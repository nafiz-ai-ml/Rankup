# Rankup — Database Architecture & PostgreSQL Schema Specification

## 1. Overview & Technology Stack

* **Database Engine**: PostgreSQL 15+ (hosted via Supabase).
* **ORM / Query Layer**: Supabase Client / Drizzle ORM / Prisma or raw typed SQL with TypeScript.
* **Key Non-Negotiables**:
  - Zero loss of payment data.
  - Strict idempotency on Paddle webhooks.
  - Concurrency safety during simultaneous payments via **PostgreSQL Advisory Locks**.
  - Row Level Security (RLS) enforcing public read-only access and service-role write operations.

---

## 2. Complete Database Schema (DDL)

```sql
-- Enable necessary PostgreSQL extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. CATEGORIES TABLE
-- ============================================================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon_name text default 'Tag',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Index for category lookup by slug
create index idx_categories_slug on categories(slug);

-- ============================================================================
-- 2. LISTINGS TABLE
-- ============================================================================
create table listings (
  id uuid primary key default gen_random_uuid(),
  destination_type text not null check (
    destination_type in ('website', 'x_profile')
  ),
  destination_url text,
  x_handle text,
  normalized_key text unique not null, -- Normalized domain or lowercased X handle
  slug text unique not null,           -- Public URL slug: /r/[slug]
  title text not null,
  short_description text,
  image_url text,
  favicon_url text,
  category_id uuid not null references categories(id) on delete restrict,
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'active', 'archived', 'removed')
  ),
  first_paid_at timestamptz,
  expires_at timestamptz,              -- Calculated as last payment timestamp + 7 days
  click_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Performance Indexes
create index idx_listings_status on listings(status);
create index idx_listings_normalized_key on listings(normalized_key);
create index idx_listings_slug on listings(slug);
create index idx_listings_category_id on listings(category_id);
create index idx_listings_expires_at on listings(expires_at) where status = 'active';

-- ============================================================================
-- 3. PAYMENTS TABLE
-- ============================================================================
create table payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  paddle_event_id text unique,          -- Used for strict webhook idempotency
  paddle_transaction_id text,
  paddle_customer_email text,
  amount_usd integer not null check (amount_usd >= 5 and amount_usd <= 99999),
  status text not null default 'pending' check (
    status in ('pending', 'succeeded', 'failed')
  ),
  boost_window_expires_at timestamptz, -- payment confirmation timestamp + 15 minutes
  raw_payload jsonb,                   -- Complete webhook payload stored for audit trail
  created_at timestamptz default now()
);

create index idx_payments_listing_id on payments(listing_id);
create index idx_payments_paddle_event_id on payments(paddle_event_id);
create index idx_payments_status on payments(status);

-- ============================================================================
-- 4. LISTING_SPEND TABLE (DENORMALIZED AGGREGATE FOR O(1) RANKING)
-- ============================================================================
create table listing_spend (
  listing_id uuid primary key references listings(id) on delete cascade,
  all_time_total integer not null default 0,
  today_total integer not null default 0,
  today_date date not null default current_date,
  last_paid_at timestamptz,
  updated_at timestamptz default now()
);

create index idx_listing_spend_all_time on listing_spend(all_time_total desc);
create index idx_listing_spend_today on listing_spend(today_date, today_total desc);

-- ============================================================================
-- 5. RANK_EVENTS TABLE (AUDIT HISTORY & CHART DATA)
-- ============================================================================
create table rank_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  event_type text not null check (
    event_type in ('created', 'boosted', 'outbid', 'reclaimed', 'expired')
  ),
  previous_rank integer,
  new_rank integer,
  amount_usd integer,
  created_at timestamptz default now()
);

create index idx_rank_events_listing_id on rank_events(listing_id, created_at desc);

-- ============================================================================
-- 6. MODERATION & BLACKLIST TABLE
-- ============================================================================
create table blacklist (
  id uuid primary key default gen_random_uuid(),
  pattern text unique not null,        -- e.g. 'badsite.com', '@spamhandle'
  type text not null check (type in ('domain', 'x_handle', 'keyword')),
  reason text,
  created_at timestamptz default now()
);

create index idx_blacklist_pattern on blacklist(pattern);
```

---

## 3. Concurrency Protection & Transaction Safety

To avoid race conditions when two users pay at the exact same second to claim `#1`, all rank calculations and spend updates must execute within a transactional advisory lock:

```sql
-- Lock ID constant: 918273645
create or replace function process_successful_payment(
  p_listing_id uuid,
  p_event_id text,
  p_transaction_id text,
  p_email text,
  p_amount integer,
  p_payload jsonb
) returns void as $$
declare
  v_inserted boolean;
begin
  -- 1. Acquire transaction-level advisory lock
  perform pg_advisory_xact_lock(918273645);

  -- 2. Idempotent insert of payment record
  insert into payments (
    listing_id,
    paddle_event_id,
    paddle_transaction_id,
    paddle_customer_email,
    amount_usd,
    status,
    boost_window_expires_at,
    raw_payload
  ) values (
    p_listing_id,
    p_event_id,
    p_transaction_id,
    p_email,
    p_amount,
    'succeeded',
    now() + interval '15 minutes',
    p_payload
  )
  on conflict (paddle_event_id) do nothing;

  -- 3. If duplicate event, exit gracefully
  if not found then
    return;
  end if;

  -- 4. Update listing spend totals
  insert into listing_spend (listing_id, all_time_total, today_total, today_date, last_paid_at)
  values (p_listing_id, p_amount, p_amount, current_date, now())
  on conflict (listing_id) do update set
    all_time_total = listing_spend.all_time_total + p_amount,
    today_total = case 
      when listing_spend.today_date = current_date then listing_spend.today_total + p_amount
      else p_amount
    end,
    today_date = current_date,
    last_paid_at = now(),
    updated_at = now();

  -- 5. Activate or extend listing visibility by 7 full days
  update listings set
    status = 'active',
    first_paid_at = coalesce(first_paid_at, now()),
    expires_at = now() + interval '7 days',
    updated_at = now()
  where id = p_listing_id;

end;
$$ language plpgsql;
```

---

## 4. Row Level Security (RLS) Policies

Rankup is a zero-auth public platform. Public visitors only read active or archived data; modifications are restricted to Supabase Service Role (backend webhook server):

```sql
-- Enable RLS on all tables
alter table categories enable row level security;
alter table listings enable row level security;
alter table payments enable row level security;
alter table listing_spend enable row level security;
alter table rank_events enable row level security;
alter table blacklist enable row level security;

-- 1. Public can view all categories
create policy "Public read categories" on categories
  for select using (true);

-- 2. Public can view active and archived listings (NOT pending_payment or removed)
create policy "Public read active listings" on listings
  for select using (status in ('active', 'archived'));

-- 3. Public can view spend totals for ranking
create policy "Public read listing spend" on listing_spend
  for select using (true);

-- 4. Public can view public rank events
create policy "Public read rank events" on rank_events
  for select using (true);

-- 5. Service role has full access to process webhooks and manage listings
-- (Supabase service_role key bypasses RLS by default)
```

---

## 5. Scheduled Automation (Cron Jobs)

Using **Supabase pg_cron** or Supabase Edge Functions:

### 5.1 7-Day Expiry Worker (Every 5 Minutes)
```sql
select cron.schedule(
  'archive-expired-listings',
  '*/5 * * * *',
  $$
    update listings
    set status = 'archived', updated_at = now()
    where status = 'active'
      and expires_at <= now();
  $$
);
```

### 5.2 Midnight UTC Daily Reset (Every Night at 00:00 UTC)
```sql
select cron.schedule(
  'reset-today-leaderboard',
  '0 0 * * *',
  $$
    update listing_spend
    set today_total = 0,
        today_date = current_date
    where today_date < current_date;
  $$
);
```
