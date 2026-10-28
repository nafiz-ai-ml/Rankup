# Rankup — MVP Specification

## 1. Product overview

**Rankup** is a fully paid, zero-auth, pay-to-rank leaderboard where founders, SaaS companies, AI tools, agencies, and website owners can claim a public rank by paying through Paddle.

Core promise:

> **Claim your rank. Start at $5.**

A listing appears on the leaderboard immediately after successful Paddle payment. The more a listing has paid, the higher it ranks. Every payment buys **7 days of active rank visibility**. After 7 days, the listing moves to the archive; it is not deleted.

This is a **paid placement / sponsored ranking** product, not an editorial recommendation or organic ranking system.

## 2. Locked product decisions

| Decision | Final rule |
|---|---|
| Minimum bid | $5 USD |
| Maximum bid | $99,999 USD |
| Bid increments | Whole USD amounts only |
| #1 takeover | Current #1 cumulative amount + $2 minimum |
| Rank duration | 7 days per payment |
| Expiry behavior | Listing moves to archive, not deleted |
| Boards | All-time and Today |
| Categories | 20 launch categories |
| Authentication | None; no sign up or sign in |
| Payment provider | Paddle |
| Database | Supabase Postgres |
| Refund policy | Fully non-refundable |
| Boost Window | 15 minutes after each successful payment |
| Free listings | None; fully paid platform |
| Product page | Every listing has a dedicated public page |
| Country board | Not in MVP |
| Verification | Not in MVP |
| Wallet credit | Not in MVP |
| Rising/free section | Not in MVP |

## 3. User journey

### 3.1 Visitor journey

1. Visitor opens homepage.
2. They see the live Top 10 leaderboard and current #1 claim price.
3. They click **Claim a rank** or **Outbid**.
4. They paste a product URL or X profile handle.
5. System fetches public metadata: title, description, favicon, OG image.
6. User selects a category.
7. User enters a whole-dollar bid amount, minimum $5.
8. System calculates the achievable rank and required amount.
9. User opens Paddle Checkout.
10. Paddle confirms payment through webhook.
11. Listing becomes active and appears at the purchased rank.
12. A 15-minute Boost Window starts.

### 3.2 Boost Window

After every successful payment, the buyer receives a **15-minute Boost Window**.

Rules:

- If another user outbids the listing during the Boost Window, the original buyer may reclaim the rank by paying the difference plus $2.
- Example: Buyer A pays $50. Buyer B pays $52 during Boost Window. Buyer A can reclaim by paying $4, bringing their cumulative total to $56.
- Boost Window expires after 15 minutes.
- After expiry, normal outbid rules apply.
- Boost Window is shown with a countdown timer.
- If buyer email is available from Paddle, send an outbid alert email.
- If email is unavailable, show an on-site live alert only.

## 4. Ranking rules

### 4.1 Active listing

A listing is active if:

```sql
expires_at > now()
```

### 4.2 All-time board

All-time board ranks active listings by cumulative paid amount.

```sql
order by all_time_total desc, first_paid_at asc
```

If two listings have the same cumulative amount, the earlier listing ranks higher.

### 4.3 Today board

Today board ranks listings by amount paid during the current UTC day.

```sql
where today_date = current_date
order by today_total desc, first_payment_today_at asc
```

At UTC midnight, the Today board resets. The previous day becomes a read-only daily archive.

### 4.4 Category board

Each category has its own All-time and Today board. The ranking logic is identical, but filtered by `category_id`.

### 4.5 #1 rule

To claim #1, a buyer must pay:

```ts
requiredAmount = currentTopCumulativeTotal + 2
```

Example:

- Current #1 total: $100
- Required new cumulative total: $102
- If buyer already has $80 cumulative: they pay $22
- If buyer is new: they pay $102

## 5. Listing rules

A submission can be either:

- A website URL
- An X/Twitter profile handle

### 5.1 Website submission

Accepted:

- `https://example.com`
- `https://example.com/product`
- `https://www.example.com`

Processing:

- Normalize URL.
- Strip tracking parameters: `utm_*`, `fbclid`, `gclid`, `ref`, `affiliate`.
- Resolve common shorteners where safely possible.
- Detect duplicate destination using `normalized_key`.
- Fetch Open Graph metadata: title, description, image, favicon.
- Allow user to edit title and short description before checkout.

### 5.2 X profile submission

Accepted:

- `https://x.com/handle`
- `https://twitter.com/handle`
- `@handle`

Processing:

- Extract handle.
- Fetch public X profile metadata where available.
- If metadata cannot be fetched, allow manual title, description, and image upload.

### 5.3 Duplicate rule

One normalized destination can have only one active listing.

If the destination already has an active listing, the user cannot create a duplicate. They may boost the existing listing by paying the difference required for a higher rank.

## 6. Categories

Launch with 20 categories:

1. AI Agents & Automation
2. AI Image & Video
3. AI Writing & Content
4. AI Coding & Developer Tools
5. SaaS & Productivity
6. Marketing & Advertising
7. SEO & AI Visibility
8. Social Media & Creator Tools
9. Sales & Lead Generation
10. Ecommerce & Retail
11. Fintech & Payments
12. Crypto & Web3
13. Education & Learning
14. Health & Fitness
15. Hiring & Jobs
16. Design & Creative
17. Agencies & Services
18. Real Estate & Property
19. Travel & Local
20. Other

Each category has:

- Its own All-time leaderboard
- Its own Today leaderboard
- Its own category landing page
- Its own product listings

## 7. Pages

### 7.1 Homepage

Purpose: convert visitors into paid listings and show live social proof.

Sections:

1. Hero
2. Live Top 10 leaderboard
3. How it works
4. Category chips
5. Latest activity
6. Trust strip
7. FAQ
8. Footer

### 7.2 Full leaderboard

Purpose: show all active listings.

Features:

- All-time / Today toggle
- Category filter
- Search by product name or domain
- Rank, logo, name, description, category, amount, expiry, CTA
- Pagination or infinite scroll
- Sponsored placement disclosure

### 7.3 Category page

Purpose: category-specific discovery and ranking.

URL:

```text
/c/[category-slug]
```

Sections:

- Category title and description
- Category All-time / Today toggle
- Category leaderboard
- Related categories
- Claim rank CTA

### 7.4 Product page

Purpose: dedicated public page for each paid listing.

URL:

```text
/r/[listing-slug]
```

Sections:

- Product header
- Current rank card
- Rank history
- Boost panel
- Similar products
- Sponsored disclosure
- Related category CTA

### 7.5 Submit / claim flow

Purpose: collect URL or X handle, metadata, category, and bid.

Steps:

1. Destination input
2. Metadata preview
3. Category selection
4. Bid amount selection
5. Rank preview
6. Paddle Checkout
7. Success screen

### 7.6 Today archive

Purpose: show previous daily boards.

URL:

```text
/archive/[yyyy-mm-dd]
```

### 7.7 Legal pages

- `/terms`
- `/privacy`
- `/refund-policy`
- `/paid-placement`

## 8. Payment flow

### 8.1 Paddle integration

Use Paddle Checkout.

Flow:

1. Create a `pending_payment` record in Supabase.
2. Pass `pending_payment_id` through Paddle `custom_data`.
3. Open Paddle Checkout.
4. Paddle sends `transaction.paid` webhook.
5. Verify webhook signature.
6. Check `event_id` for idempotency.
7. Run a Supabase Postgres transaction.
8. Add amount to listing spend.
9. Recalculate rank.
10. Mark payment succeeded.
11. Start Boost Window.

### 8.2 Webhook safety

Required rules:

- Verify Paddle signature.
- Use `event_id` as a unique key.
- Never trust client-side success.
- Handle duplicate and out-of-order webhooks.
- Use `transaction.paid` as the only rank-assignment trigger.
- Store raw webhook payload for audit.
- Return `200` quickly; process heavy work asynchronously if needed.

Paddle webhooks are delivered at least once and may arrive out of order, so idempotency is mandatory.

### 8.3 Refunds

All payments are final and non-refundable.

Refund policy must clearly state that a payment does not guarantee a permanent rank, a specific traffic volume, conversions, or immunity from being outbid.

## 9. Database schema

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  destination_type text not null check (
    destination_type in ('website', 'x_profile')
  ),
  destination_url text,
  x_handle text,
  normalized_key text unique not null,
  slug text unique not null,
  title text not null,
  short_description text,
  image_url text,
  favicon_url text,
  category_id uuid not null references categories(id),
  status text not null default 'active' check (
    status in ('pending_payment', 'active', 'archived', 'removed')
  ),
  first_paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id),
  paddle_event_id text unique,
  paddle_transaction_id text,
  paddle_customer_email text,
  amount_usd integer not null,
  status text not null default 'pending' check (
    status in ('pending', 'succeeded', 'failed')
  ),
  boost_window_expires_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz default now()
);

create table listing_spend (
  listing_id uuid primary key references listings(id),
  all_time_total integer not null default 0,
  today_total integer not null default 0,
  today_date date not null default current_date,
  last_paid_at timestamptz,
  updated_at timestamptz default now()
);

create table rank_events (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id),
  event_type text not null check (
    event_type in ('created', 'boosted', 'outbid', 'reclaimed', 'expired')
  ),
  previous_rank integer,
  new_rank integer,
  amount_usd integer,
  created_at timestamptz default now()
);
```

## 10. Critical backend logic

### 10.1 Rank assignment

Rank assignment must happen inside a database transaction.

Use:

```sql
select pg_advisory_xact_lock(918273645);
```

This prevents two simultaneous successful payments from receiving conflicting ranks.

### 10.2 Payment idempotency

```sql
insert into payments (
  listing_id,
  paddle_event_id,
  paddle_transaction_id,
  amount_usd,
  status
)
values (...)
on conflict (paddle_event_id) do nothing;
```

If the insert affects zero rows, stop processing. The webhook is duplicate.

### 10.3 Expiry job

Run a scheduled job every 5 minutes:

```sql
update listings
set status = 'archived'
where status = 'active'
  and expires_at <= now();
```

Also create `rank_events` records with `event_type = 'expired'`.

### 10.4 Today reset

At UTC midnight:

- Freeze the previous day’s Today board into archive.
- Reset `today_total` to 0.
- Set `today_date` to the new UTC date.

This can be handled by a scheduled Supabase Edge Function or cron job.

## 11. Admin panel

A simple password-protected admin panel is required.

Admin can:

- View all listings
- Search by URL, X handle, title, payment ID
- Archive or remove listing
- Edit title, description, image, category
- View payments and webhook logs
- Retry failed webhook processing
- Block domains or X handles
- View daily revenue, active listings, and top categories

Admin authentication can be a single environment-variable password protected by middleware. This does not affect the public zero-auth experience.

## 12. Moderation rules

Automatically reject or manually review:

- Phishing, malware, scam, or impersonation
- Adult / NSFW content
- Illegal products or services
- Telegram, WhatsApp, Discord, Messenger, or Signal invite links
- Link shorteners that hide the final destination
- Tracking-heavy or affiliate-only URLs
- Empty, parked, or non-functional websites
- Copyright-infringing content

Every listing must display:

> **Sponsored placement. Rank is determined by payment, not editorial review.**

## 13. Analytics

Track:

- Homepage views
- Claim flow started
- URL submitted
- Metadata fetched
- Checkout opened
- Payment succeeded
- Payment failed
- Boost Window started
- Boost Window match completed
- Outbid events
- Category page views
- Product page views
- Clicks on website links

Use PostHog or Plausible. Do not block payment flow if analytics fails.

## 14. MVP success metrics

| Metric | Target |
|---|---|
| Homepage to claim-flow start | 8%+ |
| Claim-flow start to checkout | 40%+ |
| Checkout to successful payment | 40%+ |
| First-week paid listings | 50+ |
| Repeat boost rate | 20%+ |
| Boost Window match rate | 10%+ |
| Payment success rate | 95%+ |

## 15. Out of scope

The following are explicitly excluded from MVP:

- User accounts
- Sign up / sign in
- Email verification
- Free listings
- Rising algorithmic section
- Country-specific boards
- Domain verification
- Wallet credit
- Refund or partial credit
- API access
- Team accounts
- Comments or reviews
- Voting
- Automated fraud scoring
- Multi-language UI
- Mobile app
