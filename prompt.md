# Rankup — Master Implementation Roadmap & Prompt Engineering Blueprint

## 1. Executive Overview & Technical Stack

This document serves as the master blueprint for the end-to-end development of **Rankup** (a high-conversion, pay-to-rank public leaderboard inspired by `outbid.lol`, enhanced with a persistent left sidebar, 7-day visibility lifecycle, and a 15-minute Boost Window).

Each development phase below is engineered as an **autonomous, production-grade AI Developer Prompt**. These prompts incorporate explicit persona modeling, prerequisite dependencies, file cross-references, granular technical constraints, error-handling protocols, and rigorous acceptance criteria.

### Canonical Technical Stack:
* **Framework**: Next.js 14+ (App Router, Server Actions, Route Handlers, TypeScript strict mode)
* **Design & Styling**: Tailwind CSS, CSS Custom Properties, Glassmorphism utilities, Lucide React icons
* **Database & Persistence**: Supabase PostgreSQL 15+ (Postgres functions, Advisory Locks, pg_cron)
* **Payment Gateway**: Paddle Billing (Overlay checkout, HMAC-SHA256 webhooks, idempotent event handling)
* **Metadata Extraction**: Cheerio, OpenGraph protocol, Google Favicon fallback engine
* **Animations & Micro-interactions**: Canvas Confetti, Framer Motion (subtle UI feedback)

---

## 2. Component & Directory Architecture Map

```text
/
├── Brand Logo file/             # Vector SVGs (mark, dark/light logos) & Favicons
├── public/                      # Static brand assets, favicons, OG placeholders
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx       # Root layout with Sidebar and ThemeProvider
│   │   │   ├── page.tsx         # Homepage (Hero, Claim Bar, Top 10, Stats)
│   │   │   ├── leaderboard/     # All-time and Today leaderboards
│   │   │   ├── c/[slug]/        # Category-specific dedicated leaderboards
│   │   │   ├── r/[slug]/        # Public product detail page with rank chart
│   │   │   ├── archive/         # Daily UTC history & calendar archive
│   │   │   ├── rules/           # Platform rules, pricing, and FAQ
│   │   │   ├── about/           # Origin story, metrics, and founder info
│   │   │   └── legal/           # /terms, /privacy, /refund-policy, /paid-placement
│   │   ├── admin/               # Password-protected admin surface
│   │   │   ├── layout.tsx       # Admin auth middleware wrapper
│   │   │   ├── page.tsx         # Executive financial KPI overview
│   │   │   ├── listings/        # Moderation, edit, archive, remove
│   │   │   ├── payments/        # Webhook audit log inspector & manual retry
│   │   │   └── blacklist/       # Banned domains & handle management
│   │   └── api/
│   │       ├── checkout/        # Paddle session initialization
│   │       ├── webhooks/paddle/ # HMAC verified idempotent payment handler
│   │       ├── metadata/scrape/ # URL normalizer & OG scraper
│   │       └── cron/            # Expiry (5m) & Midnight UTC reset jobs
│   ├── components/
│   │   ├── layout/              # Sidebar, MobileBottomNav, MobileDrawer, Header
│   │   ├── leaderboard/         # ListingCard, PodiumCard, TableView, ActivityTicker
│   │   ├── claim/               # ClaimModal, StepDestination, StepBid, BoostTimer
│   │   ├── ui/                  # Button, Badge, Modal, Input, Stepper, ThemeToggle
│   │   └── admin/               # MetricCard, ListingsTable, WebhookLogViewer
│   ├── lib/
│   │   ├── supabase/            # Client, Server, and Admin Service-Role clients
│   │   ├── paddle/              # Paddle SDK initialization & signature verifier
│   │   ├── scraper/             # URL normalizer, OG parser, favicon resolver
│   │   └── utils/               # Currency, rank calculator, date-fns formatters
│   └── types/                   # Database DDL types & Component Props
```

---

## 3. Phased AI Developer Prompts

---

### Phase 1: Foundation, Design Tokens, Typography & Persistent Left Sidebar Layout

```markdown
### [PROMPT: PHASE 1]
**Role**: Senior Next.js 14 Frontend Architect & UI/UX Systems Specialist.

**Context & Prerequisites**:
You are establishing the foundational code for Rankup. Before writing any code, thoroughly review:
1. `design_guide.md` (Design tokens, Royal Blue `#2563EB`, Sky Blue `#60A5FA`, Dark Slate `#0B0F19`, typography scale, border radii, glassmorphism rules).
2. `ui_ux.md` (Left Sidebar architecture, navigation links, UTC reset counter, live stats widget).
3. `responsive.md` (Sidebar collapsing to Sticky Bottom Navigation App Bar `<640px` and Slide-out Drawer `<768px`).
4. Brand assets in `Brand Logo file/` (`rankup-logo-dark-bg.svg`, `rankup-logo-light-bg.svg`, `rankup-mark.svg`, favicons).

**Objective**:
Scaffold the complete Next.js 14 App Router project with TypeScript, configure Tailwind CSS with custom design tokens, implement the responsive layout container with the persistent Left Sidebar, and prepare the theme provider (Dark/Light mode).

**Granular Implementation Tasks**:
1. **Project Setup & Dependencies**:
   - Initialize Next.js 14 App Router with TypeScript and strict mode.
   - Install required packages: `lucide-react`, `clsx`, `tailwind-merge`, `next-themes`, `date-fns`, `canvas-confetti`.
   - Copy brand assets from `Brand Logo file/` into `/public/brand/` and set up `/public/favicon.ico`.
2. **Design Tokens & Tailwind Configuration**:
   - In `tailwind.config.ts`, extend the theme with:
     * Brand palette: `brand-primary` (`#2563EB`), `brand-hover` (`#1D4ED8`), `brand-accent` (`#3B82F6`), `brand-light` (`#60A5FA`).
     * Surface backgrounds: `bg-body` (`#0B0F19`), `bg-sidebar` (`#0E1424`), `bg-surface` (`#111827`), `bg-elevated` (`#1E293B`).
     * Podium accents: `podium-gold` (`#F59E0B`), `podium-silver` (`#94A3B8`), `podium-bronze` (`#B45309`).
     * Status: `live-emerald` (`#10B981`), `boost-gradient` (`linear-gradient(135deg, #8B5CF6, #EC4899)`).
   - Configure typography with `Inter` / `Geist Sans` as primary font and `JetBrains Mono` / `Geist Mono` as monospace font.
   - Implement custom glassmorphic utility classes (`backdrop-blur-md`, subtle border glows).
3. **Persistent Left Sidebar (`components/layout/Sidebar.tsx`)**:
   - Fixed desktop sidebar (`w-64` / `260px`, full height, sticky left).
   - Brand header with `rankup-logo-dark-bg.svg` (and light-bg variant for light theme) + live green pulse dot ("Live Board").
   - Navigation links with active states and Lucide icons: Home (`/`), All-Time Board (`/leaderboard?board=all-time`), Today's Board (`/leaderboard?board=today`), Categories (`/categories`), Archive (`/archive`), Rules (`/rules`), About (`/about`).
   - Live UTC Countdown Mini-Card: JavaScript timer calculating hours:minutes:seconds remaining until `00:00:00 UTC` ("Resets in HH:MM:SS").
   - Platform Live Stats Widget: Display simulated live visitors ("17 online • 1,240 today").
   - Primary Sidebar Action: Full-width Electric Blue "Claim a Rank" CTA with upward chevron icon.
   - Sidebar Footer: Dark/Light Mode toggle and mini legal links.
4. **Mobile Navigation Adaptation (`components/layout/MobileNav.tsx`)**:
   - For viewports `<768px`: Render a fixed top header with brand mark, live green dot, theme switch, and hamburger toggle.
   - Render a **Sticky Bottom Navigation App Bar** (`h-16`, fixed bottom, glassmorphic) featuring Home, Today, Categories sheet trigger, and a prominent floating "Claim" button.
   - Implement the slide-out Mobile Drawer for secondary pages.

**Technical Constraints & Non-Negotiables**:
- Zero horizontal layout shift (CLS); explicit dimensions on logos.
- Touch targets on mobile must strictly meet or exceed `44x44px`.
- SSR compatible: Prevent hydration mismatch on the UTC timer and theme switcher.

**Acceptance Criteria**:
- [ ] Next.js app builds with zero TypeScript or Tailwind errors.
- [ ] Desktop viewport displays the fixed left sidebar and clean main canvas.
- [ ] Resizing to mobile (`<640px`) automatically hides the desktop sidebar and activates the bottom app bar.
- [ ] Theme switcher switches between Dark Slate (`#0B0F19`) and Clean Light (`#F8FAFC`).
- [ ] Live UTC countdown updates accurately every second.
```

---

### Phase 2: Supabase Schema, Migrations, Postgres Advisory Locks & Seed Data

```markdown
### [PROMPT: PHASE 2]
**Role**: Principal Database Engineer & Supabase Postgres Specialist.

**Context & Prerequisites**:
You are architecting the database foundation for Rankup. Before writing SQL or TypeScript, review:
1. `database.md` (Complete DDL, indexes, advisory locking, RLS policies, automated cron jobs).
2. `ranking_rules.md` (Tie-breaking rules, cumulative spend aggregation, 7-day expiry).
3. `MVP.md` (Locked product decisions: 20 launch categories, zero-auth architecture).

**Objective**:
Deploy the complete Supabase PostgreSQL schema, establish bulletproof transactional concurrency protection via PostgreSQL Advisory Locks, configure Row Level Security (RLS), set up TypeScript database types, and write a comprehensive database seed script.

**Granular Implementation Tasks**:
1. **Schema Migration Script (`supabase/migrations/001_initial_schema.sql`)**:
   - Create tables with exact column types, primary keys, and foreign keys:
     * `categories`: id (uuid), slug (unique), name, description, icon_name, sort_order.
     * `listings`: id (uuid), destination_type (`website` | `x_profile`), destination_url, x_handle, normalized_key (unique), slug (unique), title, short_description, image_url, favicon_url, category_id, status (`pending_payment` | `active` | `archived` | `removed`), first_paid_at, expires_at, click_count, created_at, updated_at.
     * `payments`: id (uuid), listing_id, paddle_event_id (unique), paddle_transaction_id, paddle_customer_email, amount_usd, status (`pending` | `succeeded` | `failed`), boost_window_expires_at, raw_payload (jsonb), created_at.
     * `listing_spend`: listing_id (primary key), all_time_total, today_total, today_date, last_paid_at, updated_at.
     * `rank_events`: id (uuid), listing_id, event_type (`created` | `boosted` | `outbid` | `reclaimed` | `expired`), previous_rank, new_rank, amount_usd, created_at.
     * `blacklist`: id (uuid), pattern (unique), type (`domain` | `x_handle` | `keyword`), reason, created_at.
   - Create performance composite indexes on `listings(status, expires_at)`, `listing_spend(all_time_total desc)`, and `listing_spend(today_date, today_total desc)`.
2. **PostgreSQL Advisory Lock Function**:
   - Implement `process_successful_payment` stored procedure in PL/pgSQL.
   - Enforce `select pg_advisory_xact_lock(918273645);` at the start of the transaction to serialize concurrent checkout webhooks.
   - Handle idempotent insert on `payments(paddle_event_id)` (exit if event already processed).
   - Upsert `listing_spend` (accumulate `all_time_total`, handle `today_total` reset if date rolled over).
   - Set listing status to `active`, set `first_paid_at` if null, and set `expires_at = now() + interval '7 days'`.
   - Set `boost_window_expires_at = now() + interval '15 minutes'`.
3. **Row Level Security (RLS) Configuration**:
   - Enable RLS on all tables.
   - Create permissive `SELECT` policies for public visitors on `categories`, `listings` (where status in active/archived), `listing_spend`, and `rank_events`.
   - Restrict all `INSERT`, `UPDATE`, `DELETE` operations strictly to `service_role` (backend API).
4. **Automated Scheduled Jobs (Supabase pg_cron)**:
   - Script the 5-minute cron: Archive listings where `status = 'active' and expires_at <= now()`.
   - Script the midnight UTC cron: Reset `today_total = 0` where `today_date < current_date`.
5. **Database Seeding (`supabase/seed.ts`)**:
   - Seed all 20 launch categories (AI Agents & Automation, AI Image & Video, SaaS & Productivity, SEO, Fintech, etc.).
   - Seed 10 realistic, diverse demo listings (e.g., AI tools, SaaS products) with realistic spend ($10 to $250), valid favicons, and active expiry dates for local UI testing.
6. **Supabase TypeScript Client Integration**:
   - Configure `/src/lib/supabase/client.ts` (public client with anon key).
   - Configure `/src/lib/supabase/admin.ts` (server-only client with service_role key).
   - Generate database TypeScript definitions in `/src/types/database.ts`.

**Technical Constraints & Non-Negotiables**:
- Never expose the `SUPABASE_SERVICE_ROLE_KEY` to client-side bundles.
- Strict database constraints: `amount_usd` between 5 and 99999; no nulls on critical foreign keys.

**Acceptance Criteria**:
- [ ] SQL migrations execute cleanly on a Supabase instance without errors.
- [ ] Calling `process_successful_payment` twice with identical `paddle_event_id` results in zero duplicate spend.
- [ ] Seed script executes and populates 20 categories and 10 active listings.
- [ ] Public anon client can query listings but receives an error when attempting to insert.
```

---

### Phase 3: Homepage, Hero Claim Bar with Stepper & High-Converting Leaderboard Cards

```markdown
### [PROMPT: PHASE 3]
**Role**: Lead Frontend UI Engineer & High-Conversion Product Designer.

**Context & Prerequisites**:
You are creating the core viral homepage of Rankup. Review:
1. `ui_ux.md` (Homepage wireframe, Hero Claim Bar, Top 10 layout, Live ticker).
2. `design_guide.md` (Podium styling: #1 Gold glow, #2 Silver, #3 Bronze, micro-animations, hover lift).
3. `responsive.md` (Desktop row layout to Mobile vertical card re-flow).
4. `Outbid.lol site reference/Today Page.png` & `reference video` for visual pacing and density.

**Objective**:
Develop the complete Homepage (`/src/app/(public)/page.tsx`) with a dynamic Hero Claim Bar, numerical +/- price steppers, board toggles (All-Time vs Today), 20 category filter chips, and high-converting listing cards.

**Granular Implementation Tasks**:
1. **Hero Section & Dynamic Price Stepper**:
   - Render the social proof banner: "17 online • 1,240 visitors today • stats →".
   - Render the dynamic Display Headline: *"Claim today's #1 for **$XX**"*.
   - Implement interactive `+` and `-` stepper buttons beside the price that calculate required whole-dollar increments.
2. **The Hero Claim Bar Component (`components/claim/HeroClaimBar.tsx`)**:
   - Single unified desktop pill bar (stacked on mobile):
     * Input: Text field for URL or `@handle` with clean globe/at icon and instant clear button.
     * Dropdown: Category selector displaying the 20 categories with subtle icons.
     * Primary CTA: Electric Blue "Claim rank" button that opens the Claim Modal passing pre-filled values.
3. **Board Control & Category Filter Toolbar**:
   - Segmented toggle pill: `All-Time` vs `Today` (with live green badge).
   - UTC Countdown display directly below the toggle ("Resets every day at midnight UTC • 08:14:22 left").
   - Horizontal scrollable Category Chips bar with "All", "AI Agents", "SaaS", etc., plus an "Explore" button.
   - View mode toggle: Card View (default) vs High-Density Table View.
4. **Leaderboard Listing Cards (`components/leaderboard/ListingCard.tsx`)**:
   - Desktop: Horizontal row layout with hover elevation.
   - Mobile: Responsive card re-flow (vertical layout, no horizontal scroll).
   - Visual Hierarchy:
     * Rank badge: Distinct **#1 Gold gradient** with subtle warm glow; **#2 Silver**; **#3 Bronze**; standard muted numbers for #4+.
     * Product Favicon/Avatar: Rounded-xl container with crisp image and fallback initial.
     * Content block: Product Title, one-line Short Description, category pill, time elapsed ("3 hours ago"), clean outbound domain link, and live click counter.
     * Spend badge: JetBrains Mono formatted dollar amount (e.g., `$102`).
     * 7-Day Expiry Tag: Visual badge indicating active visibility remaining ("5 days left").
     * Outbid CTA: "Outbid" button that pre-calculates the exact amount needed to beat this listing and opens the claim modal.
5. **Desktop Side-Rail Widgets**:
   - Render the "All-Time Ranking Mini Top 10" widget on the right side of the main board.
   - Render the "Latest Activity" ticker stream displaying recent mock/real bids.
6. **Milestone Proof Strip & FAQ**:
   - Stats cards: Total visitors, Gross revenue, Products added.
   - 5-item collapsible accordion FAQ addressing payment, 7-day duration, and outbid rules.
   - Mandatory Sponsored Placement legal disclaimer at footer.

**Technical Constraints & Non-Negotiables**:
- Fast First Contentful Paint (FCP); pre-render listing cards with SSR/ISR.
- Image optimization using `next/image` with fallback handlers for external favicons.

**Acceptance Criteria**:
- [ ] Homepage renders matching the aesthetic of `outbid.lol` while incorporating Rankup's blue identity and left sidebar.
- [ ] Clicking `+` / `-` on the stepper updates the headline amount smoothly.
- [ ] Switching between All-Time and Today toggles updates the board data immediately.
- [ ] Clicking category chips filters the displayed listings in real-time.
- [ ] Mobile view renders compact stacked cards with zero horizontal overflow.
```

---

### Phase 4: Zero-Auth Multi-Step Claim Modal, Metadata Scraper & Deduplication Engine

```markdown
### [PROMPT: PHASE 4]
**Role**: Senior Backend & Full-Stack Engineer (Cheerio, Web Scraping & Form UX).

**Context & Prerequisites**:
You are building the conversion engine of Rankup. Review:
1. `metadata_scraper.md` (URL normalization, tracking query stripping, deduplication key, Cheerio OG extraction, Google Favicon fallback).
2. `ui_ux.md` (Multi-step modal flow: Destination -> Preview -> Bid -> Checkout -> Boost).
3. `ranking_rules.md` (Achievable rank calculation, +$2 rule, $5 minimum).

**Objective**:
Build the server-side metadata scraper endpoint (`/api/metadata/scrape`) and the interactive zero-auth Claim Rank Multi-Step Modal (`components/claim/ClaimModal.tsx`).

**Granular Implementation Tasks**:
1. **Server-Side Metadata Scraper (`src/lib/scraper/extractor.ts` & Route Handler)**:
   - Input normalization:
     * Strip tracking parameters: `utm_*`, `fbclid`, `gclid`, `ref`, `source`, `affiliate`.
     * Enforce lowercase hostnames, strip trailing slashes, remove hash fragments.
     * Generate `normalized_key`: `web:hostname/path` for sites or `x:handle` for Twitter profiles.
   - Duplicate Check:
     * Query Supabase for active listings matching `normalized_key`.
     * If an active listing exists, return `{ isDuplicate: true, existingListing: {...} }` to trigger the Boost flow instead of creating a duplicate.
   - Public Scraping Engine:
     * Fetch destination HTML with realistic browser User-Agent and a 4-second timeout.
     * Parse HTML using `cheerio`.
     * Extract `og:title`, `<title>`, `og:description`, `meta[name=description]`.
     * Extract `og:image`.
     * Resolve favicon URLs (`link[rel="icon"]`, `apple-touch-icon`), resolving relative links to absolute URLs.
     * Implement ultimate fallback: Google Favicon CDN (`https://www.google.com/s2/favicons?domain=...&sz=128`).
   - X / Twitter Handle Handling:
     * Parse `@handle` or `x.com/handle`, provide default avatar and pre-fill title with `@handle`.
2. **Claim Modal Multi-Step Form (`components/claim/ClaimModal.tsx`)**:
   - Manage multi-step state with smooth transitions:
     * **Step 1 (Destination Input)**: Text field for URL or handle with instant format validation.
     * **Step 2 (Metadata Preview & Customization)**: Display scraped card (Favicon, Title, Description). Allow user to edit Title (max 60 chars) and Description (max 140 chars) to refine their pitch.
     * **Step 3 (Category & Bid Selection)**: Category selector + Bid amount selector with preset chips: `Min $5`, `Take #3 ($XX)`, `Take #2 ($XX)`, `Take #1 ($XX)`, or `Custom Amount`.
     * **Live Rank Preview**: Display dynamic message: *"At $XX, you will claim Rank #X on the leaderboard!"*.
     * **Step 4 (Proceed to Payment)**: Button triggering Paddle Checkout integration.
3. **Responsive Modal UX**:
   - Desktop: Centered glassmorphic modal with backdrop blur.
   - Mobile: Transitions into a pull-up Bottom Sheet Drawer (`max-h-[90vh]`) with keyboard-safe input padding.

**Technical Constraints & Non-Negotiables**:
- Scraper must never hang or crash the server; wrap all network requests in `try/catch` with `AbortSignal.timeout(4000)`.
- Sanitize all user inputs against XSS and script injection.

**Acceptance Criteria**:
- [ ] Submitting a real URL (e.g., `https://github.com`) extracts its title, description, and favicon within 1.5 seconds.
- [ ] Submitting a URL with `?utm_source=twitter&ref=123` correctly strips query params and normalizes the URL.
- [ ] Submitting a URL that already exists triggers the "Already Active — Boost Instead" prompt.
- [ ] User can edit title and description in the preview step.
- [ ] Bid selector accurately calculates the required dollar amount to claim #1, #2, or #3.
```

---

### Phase 5: Paddle Checkout Integration, Secure HMAC Webhook Receiver & Idempotent Ranking

```markdown
### [PROMPT: PHASE 5]
**Role**: Senior Fintech & Payment Integration Engineer (Paddle Billing & Security Specialist).

**Context & Prerequisites**:
You are implementing the payment and transaction engine for Rankup. Review:
1. `paddle_integration.md` (Paddle overlay configuration, custom_data payload, HMAC-SHA256 signature verification, idempotency on `paddle_event_id`, error handling).
2. `database.md` (PostgreSQL function `process_successful_payment` with advisory lock `pg_advisory_xact_lock(918273645)`).
3. `MVP.md` (No-refund policy, zero-trust client side, 7-day visibility activation).

**Objective**:
Integrate the frontend Paddle.js Checkout Overlay, build the secure server-side webhook receiver route (`/api/webhooks/paddle`), and execute atomic, concurrent-safe rank assignment in Supabase.

**Granular Implementation Tasks**:
1. **Frontend Paddle.js Integration (`src/lib/paddle/client.ts`)**:
   - Initialize Paddle.js with environment variables (`NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, sandbox or production).
   - Implement `openPaddleCheckout({ listingId, paymentId, amountUsd, email })`:
     * Open Paddle overlay with dark theme.
     * Inject critical tracking metadata into `customData`: `listing_id`, `pending_payment_id`, `bid_amount_usd`, `platform: 'rankup'`.
     * Configure success and close callbacks.
2. **Checkout Session Creation Route (`/api/checkout/create-session`)**:
   - Accepts destination URL, category, title, description, and bid amount.
   - Inserts or fetches listing record with `status = 'pending_payment'`.
   - Inserts pending payment record in `payments` table.
   - Returns `listing_id` and `payment_id` to client to initiate Paddle checkout.
3. **Paddle Webhook Signature Verification (`src/lib/paddle/verify.ts`)**:
   - Implement `verifyPaddleWebhook(rawBody, signatureHeader, secretKey)`:
     * Parse `ts` (timestamp) and `h1` (hash) from `Paddle-Signature` header.
     * Enforce replay attack prevention: Reject requests where `|now - ts| > 300` seconds.
     * Recreate HMAC-SHA256 signature using `PADDLE_WEBHOOK_SECRET_KEY` on `${ts}:${rawBody}`.
     * Compare using `crypto.timingSafeEqual` to prevent timing attacks.
4. **Webhook Route Handler (`/api/webhooks/paddle/route.ts`)**:
   - Receive raw POST request body.
   - Verify signature; return 401 Unauthorized if invalid.
   - Parse event:
     * Check `event_type === 'transaction.paid'`.
     * Extract `event_id`, `transaction.id`, `customer.email`, and `custom_data`.
   - Execute database transaction:
     * Call Supabase RPC `process_successful_payment`.
     * Verify execution acquired the advisory lock and safely committed payment.
   - Return 200 OK immediately to Paddle.
5. **Client-Side Real-Time Confirmation**:
   - Upon Paddle checkout completion, client displays a waiting / celebration state.
   - Client polls `/api/listings/status?id=...` or listens via Supabase Realtime until `status === 'active'`.
   - Fire celebratory confetti (`canvas-confetti`) and activate the 15-Minute Boost Window banner.

**Technical Constraints & Non-Negotiables**:
- NEVER credit ranks from frontend callbacks; rank is solely granted by verified webhook.
- Strict idempotency: If Paddle resends the same `event_id`, the database must ignore it without duplicating spend or rank.
- Store raw webhook JSON payload in `payments.raw_payload` for auditability.

**Acceptance Criteria**:
- [ ] Webhook endpoint rejects requests with missing or invalid Paddle signatures with HTTP 401.
- [ ] Valid `transaction.paid` webhook activates the listing, credits spend, and sets `expires_at = now() + 7 days`.
- [ ] Sending duplicate webhooks with the same `event_id` causes zero duplicate spend.
- [ ] Client checkout flow cleanly transitions from Paddle modal to rank celebration.
```

---

### Phase 6: 15-Minute Boost Window Engine, Real-Time Countdown & Product Detail Page

```markdown
### [PROMPT: PHASE 6]
**Role**: Senior Full-Stack Engineer & Product Retention Specialist.

**Context & Prerequisites**:
You are building Rankup's flagship retention feature: the 15-Minute Boost Window and dedicated public product pages. Review:
1. `ranking_rules.md` (Boost Window rules, reclaim price calculation: Difference + $2, countdown lifecycle).
2. `ui_ux.md` (Floating Boost Banner, Product Detail Page `/r/[slug]` layout, Rank History Chart).
3. `database.md` (`rank_events` audit table, `boost_window_expires_at`).

**Objective**:
Implement the 15-Minute Boost Window engine with floating live countdown timers, discounted reclaim logic, and create the dedicated public Product Detail Page (`/r/[listing-slug]`).

**Granular Implementation Tasks**:
1. **The 15-Minute Boost Window Engine (`components/claim/BoostWindowBanner.tsx`)**:
   - Activates immediately following successful payment confirmation (`boost_window_expires_at = payment_time + 15 minutes`).
   - Renders a floating, sticky banner at the top or bottom of the screen with a gradient border (`#8B5CF6` to `#EC4899`).
   - Real-time countdown timer: Displays `MM:SS` ticking down to 0.
   - State A (Protected): *"🛡️ Boost Protection Active: [14:45] — Your rank is secured. Instant alerts enabled."*
   - State B (Outbid Alert):
     * If another buyer outbids this listing during the 15 minutes, the banner flashes amber/red with an urgent pulse.
     * Displays: *"⚠️ You were outbid by [Competitor Name]! Reclaim your rank for only $X (Expires in MM:SS)"*.
     * Includes an instant **"Reclaim Rank"** CTA that pre-fills the exact discounted takeover price into checkout.
2. **Dedicated Public Product Detail Page (`src/app/(public)/r/[slug]/page.tsx`)**:
   - Dynamic route for every paid listing (`/r/[listing-slug]`), optimized for SEO and backlink equity:
   - **Product Header**: Large favicon, Title, Description, Category Chip, and "Visit Website" direct outbound link with click tracking.
   - **Current Rank Card**: Displays current All-Time Rank (#X), Category Rank (#X in Category), Cumulative Spend ($XXX), and 7-day visibility status timer.
   - **Interactive Boost Panel**:
     * Quick price calculation widget: *"Pay $XX to jump from #4 to #1 right now"*.
     * Instant button to open Claim/Boost modal pre-filled with this listing.
   - **Rank History Timeline & Chart (`components/leaderboard/RankHistoryChart.tsx`)**:
     * Visual timeline of all `rank_events` (created, boosted, outbid, reclaimed) showing date, rank change, and payment amount.
   - **Competitor Strip**: Shows the 3 listings ranked immediately above and below this product in the same category.
   - Mandatory Sponsored Placement disclosure badge.
3. **Click Tracker Endpoint (`/api/clicks/[id]`)**:
   - Increment `click_count` in `listings` table and redirect visitor to `destination_url` with HTTP 302.

**Technical Constraints & Non-Negotiables**:
- Clean SEO metadata: Dynamic `generateMetadata` for `/r/[slug]` generating custom OpenGraph title, description, and Twitter cards.
- Accurate timer synchronization using server timestamp diff to prevent client clock manipulation.

**Acceptance Criteria**:
- [ ] Completing a payment starts a 15-minute countdown banner on the client.
- [ ] If outbid, the banner immediately calculates the discounted reclaim price (Difference + $2).
- [ ] Visiting `/r/[slug]` renders the dedicated product page with correct rank, spend, and history.
- [ ] Outbound "Visit Website" button accurately tracks clicks and redirects.
```

---

### Phase 7: Password-Protected Admin Panel, Moderation, Blacklist & Automated Cron Jobs

```markdown
### [PROMPT: PHASE 7]
**Role**: Senior Security Architect & Backend DevOps Specialist.

**Context & Prerequisites**:
You are building the administrative controls and scheduled automation for Rankup. Review:
1. `admin_and_moderation.md` (Zero-auth admin model via `ADMIN_SECRET_KEY`, listings moderation, blacklist engine, audit logs).
2. `database.md` (pg_cron queries for 5-minute expiry archival and midnight UTC reset).
3. `MVP.md` (Admin panel requirements, search by URL/handle/ID, webhook retry tool).

**Objective**:
Build the password-protected Admin Dashboard (`/admin`), Next.js Middleware route guard, moderation tools (edit, archive, remove, blacklist), webhook log inspector with manual retry, and configure the automated cron jobs.

**Granular Implementation Tasks**:
1. **Admin Authentication & Middleware (`src/middleware.ts` & `/admin/login`)**:
   - Guard all `/admin/*` routes (except `/admin/login`).
   - Middleware inspects encrypted `HttpOnly` cookie (`rankup_admin_session`).
   - If cookie invalid or missing, redirect to `/admin/login`.
   - `/admin/login`: Clean password input comparing against `process.env.ADMIN_SECRET_KEY`. On match, set encrypted session cookie and redirect to `/admin`.
2. **Admin KPI Dashboard (`src/app/admin/page.tsx`)**:
   - KPI Cards: Gross Platform Revenue (USD), Today's Revenue, Active Listings Count, Average Spend per Listing, Boost Window Conversion Rate.
   - Revenue breakdown chart by top categories.
3. **Listings Management Interface (`src/app/admin/listings/page.tsx`)**:
   - Data table with search bar (by Title, URL, X handle, or ID) and filter by Status (`active`, `archived`, `pending_payment`, `removed`).
   - Actions per row:
     * **Edit**: Modal to edit Title, Description, Image URL, or Category.
     * **Force Archive**: Manually move listing to `archived` before 7 days.
     * **Hard Remove**: Set `status = 'removed'` (instantly hides from public site).
     * **Blacklist Domain**: Add destination to `blacklist` table with one click.
4. **Payments & Webhook Audit Inspector (`src/app/admin/payments/page.tsx`)**:
   - Table of all records from `payments` table (Paddle Event ID, Transaction ID, Email, Amount, Status, Timestamp).
   - "Inspect Payload" drawer: Shows formatted JSON of `raw_payload`.
   - **Manual Retry Action**: Button that re-invokes `process_successful_payment` for failed or unconfirmed webhooks.
5. **Blacklist Manager (`src/app/admin/blacklist/page.tsx`)**:
   - Interface to view and add banned domain names, X handles, and prohibited keyword regex patterns.
6. **Automated Scheduled Jobs (`src/app/api/cron/route.ts`)**:
   - Secured by `CRON_SECRET` header.
   - **Expiry Worker**: Run every 5 minutes:
     ```sql
     update listings set status = 'archived', updated_at = now()
     where status = 'active' and expires_at <= now();
     ```
   - **Daily UTC Reset Worker**: Run at `00:00:00 UTC`:
     ```sql
     update listing_spend set today_total = 0, today_date = current_date
     where today_date < current_date;
     ```

**Technical Constraints & Non-Negotiables**:
- Admin panel must never be accessible without valid `ADMIN_SECRET_KEY` authentication.
- All admin mutations must run via Supabase admin service-role client.
- Cron endpoints must reject unauthorized requests without `Authorization: Bearer CRON_SECRET`.

**Acceptance Criteria**:
- [ ] Accessing `/admin` without logging in redirects to `/admin/login`.
- [ ] Entering correct `ADMIN_SECRET_KEY` grants access to dashboard KPIs and tables.
- [ ] Admin can edit listing details, force-archive, or blacklist domains.
- [ ] Webhook inspector displays raw payload and allows manual retry.
- [ ] Cron endpoint successfully archives expired listings and resets daily totals.
```
