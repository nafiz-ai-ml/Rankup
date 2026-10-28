# Rankup — Design Guide & Design System Specification

## 1. Brand Identity & Design Philosophy

**Rankup** is a high-stakes, real-time, pay-to-rank public leaderboard for founders, SaaS companies, AI products, creators, and website owners. 

### Core Design Philosophy:
* **High Trust & Financial Credibility**: Unlike spammy directories, Rankup presents itself as a sleek, fintech-grade platform with crisp vector iconography, sharp contrast, and transparent sponsored disclosures.
* **Dynamic & Alive**: The platform feels real-time with pulsing live visitor counters, a ticking UTC reset clock, instant bid calculations, and an urgent 15-minute Boost Window.
* **Modern Aesthetic**: Clean, glassmorphic cards, curated typography, subtle micro-animations, and balanced whitespace inspired by `outbid.lol` but elevated with Rankup's distinct blue branding and left-sidebar layout.

---

## 2. Color Palette & Theme Tokens

Rankup features a dedicated **Dark Mode (Default & Recommended)** and a **Crisp Light Mode**.

### 2.1 Primary Brand Colors

| Token Name | Hex Code | HSL Value | Description & Purpose |
|---|---|---|---|
| `--color-brand-primary` | `#2563EB` | `hsl(221, 83%, 53%)` | Royal Blue — Main brand color, primary CTAs, logo base |
| `--color-brand-primary-hover`| `#1D4ED8` | `hsl(224, 76%, 48%)` | Deep Blue — Hover state for primary buttons |
| `--color-brand-accent` | `#3B82F6` | `hsl(217, 91%, 60%)` | Electric Blue — Active tabs, borders, focus rings |
| `--color-brand-light` | `#60A5FA` | `hsl(213, 94%, 68%)` | Sky Blue — Secondary logo path, badges, highlights |
| `--color-brand-subtle` | `#EFF6FF` | `hsl(214, 100%, 97%)` | Tinted subtle background in light mode |

### 2.2 Dark Mode Palette (Default)

| Surface / Element | Hex Code | Purpose |
|---|---|---|
| `--bg-body` | `#0B0F19` | Main background (Deep Midnight Slate) |
| `--bg-sidebar` | `#0E1424` | Left sidebar background (slightly lighter for depth) |
| `--bg-surface` | `#111827` | Primary card background |
| `--bg-surface-elevated` | `#1E293B` | Floating modals, dropdowns, sticky components |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card and section borders |
| `--border-hover` | `rgba(96, 165, 250, 0.4)` | Highlighted card hover border |
| `--text-primary` | `#F8FAFC` | Main headings, product titles, amounts |
| `--text-secondary` | `#94A3B8` | Descriptions, time elapsed, categories |
| `--text-muted` | `#64748B` | Footers, disclosures, inactive icons |

### 2.3 Light Mode Palette

| Surface / Element | Hex Code | Purpose |
|---|---|---|
| `--bg-body` | `#F8FAFC` | Main canvas background |
| `--bg-sidebar` | `#FFFFFF` | Left sidebar canvas |
| `--bg-surface` | `#FFFFFF` | Card background |
| `--bg-surface-elevated` | `#F1F5F9` | Modals and elevated surfaces |
| `--border-subtle` | `#E2E8F0` | Dividers and card borders |
| `--border-hover` | `#93C5FD` | Card hover border |
| `--text-primary` | `#0F172A` | High contrast headings and text |
| `--text-secondary` | `#475569` | Descriptions and body text |
| `--text-muted` | `#94A3B8` | Metadata and subtle text |

### 2.4 Podium & Status Accents

| Accent | Hex Code / Gradient | Purpose |
|---|---|---|
| **Rank #1 (Gold)** | `linear-gradient(135deg, #F59E0B, #D97706)` | #1 Rank badge, gold border glow, special crown tag |
| **Rank #2 (Silver)** | `linear-gradient(135deg, #94A3B8, #64748B)` | #2 Rank badge |
| **Rank #3 (Bronze)** | `linear-gradient(135deg, #B45309, #78350F)` | #3 Rank badge |
| **Live / Active Dot** | `#10B981` | Pulsing green dot for online users and active listings |
| **Boost Window Active** | `linear-gradient(135deg, #8B5CF6, #EC4899)` | 15-minute active boost window banner & timer |
| **Danger / Outbid** | `#EF4444` | Outbid notification alert, error messages |

---

## 3. Typography Hierarchy

We use a modern, high-legibility dual-font pairing:
1. **Primary Interface Font**: `Inter` or `Geist Sans` (Google Fonts / Modern UI standard).
2. **Numbers & Monospace Data**: `JetBrains Mono` or `Geist Mono` for dollar amounts, ranks, timestamps, and countdown timers.

### Typography Scale

| Level | Size | Weight | Line Height | Font Family | Example Usage |
|---|---|---|---|---|---|
| **Display 1** | `40px` (2.5rem) | `800` (Extrabold) | `1.1` | Primary Sans | Hero Headline: "Claim today's #1 for **$26**" |
| **Heading 1** | `30px` (1.875rem) | `700` (Bold) | `1.2` | Primary Sans | Page titles: "All-Time Leaderboard", "Rules" |
| **Heading 2** | `22px` (1.375rem) | `600` (Semibold) | `1.3` | Primary Sans | Section headers: "How it works", "Top 10" |
| **Heading 3** | `18px` (1.125rem) | `600` (Semibold) | `1.4` | Primary Sans | Product card title on leaderboard |
| **Body Large** | `16px` (1rem) | `400` / `500` | `1.5` | Primary Sans | Short description in product cards |
| **Body Small** | `14px` (0.875rem) | `400` / `500` | `1.4` | Primary Sans | Metadata: clicks, category tag, timestamp |
| **Micro / Caption**| `12px` (0.75rem) | `500` / `600` | `1.3` | Primary Sans | Badges, disclosure tags ("Sponsored") |
| **Price / Stat** | `20px - 32px` | `700` (Bold) | `1.0` | Mono Sans | `$102`, `#1`, `14:59` Boost countdown |

---

## 4. Spacing, Elevation & Component Tokens

### 4.1 Border Radii
* **Pill / Fully Rounded**: `9999px` (`rounded-full`) — Category chips, status badges, circular avatar/favicons.
* **Large Cards**: `16px` (`rounded-2xl`) — Leaderboard listing rows, hero claim box, stats cards.
* **Standard Buttons / Inputs**: `12px` (`rounded-xl`) — CTAs, URL input bar, category dropdown, modals.
* **Sub-items / Icons**: `8px` (`rounded-lg`) — Product favicons, social icons, dropdown menu items.

### 4.2 Shadows & Glassmorphism
* **Subtle Glass Blur**: `backdrop-blur-md` (`12px` blur).
* **Card Surface Blur**: `background: rgba(17, 24, 39, 0.75)` with `border: 1px solid rgba(255, 255, 255, 0.08)`.
* **Glow Effects**:
  - Brand Glow: `box-shadow: 0 0 25px -5px rgba(37, 99, 235, 0.35)` (used on primary CTA and Hero input focus).
  - Gold #1 Glow: `box-shadow: 0 0 20px -4px rgba(245, 158, 11, 0.3)`.
  - Boost Window Glow: `box-shadow: 0 0 24px -4px rgba(139, 92, 246, 0.35)`.

---

## 5. Brand Asset Usage Guidelines

All brand assets are available in the [`Brand Logo file`](file:///e:/NAFIZ%20DAIRY/AI%20Developers/RankUp/Brand%20Logo%20file) directory:

1. **`rankup-mark.svg`**:
   - The standalone squircle mark with double upward chevrons.
   - Use in: Browser favicon, mobile app header, collapsed sidebar mode, loading spinners, social share icons.
2. **`rankup-logo-dark-bg.svg`**:
   - Full horizontal logo (mark + "Rank" in White + "up" in Sky Blue `#60A5FA`).
   - Use on: Dark backgrounds, default dark sidebar top header.
3. **`rankup-logo-light-bg.svg`**:
   - Full horizontal logo (mark + "Rank" in Dark Slate `#0F172A` + "up" in Royal Blue `#2563EB`).
   - Use on: Light mode theme sidebar top header.
4. **Favicon Assets**:
   - Standard favicon files: `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png`.

---

## 6. Micro-Interactions & Animation Standards

1. **Hover Lift**: Cards elevate slightly (`transform: translateY(-2px)`) with smooth `transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1)`.
2. **Live Pulse Indicator**: Green dot has a dual-ring pulse:
   ```css
   @keyframes pulse-ring {
     0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
     70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
     100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
   }
   ```
3. **Dynamic Bid Stepper**: Smooth numerical transition when clicking `+` or `-` buttons on the claim widget.
4. **Boost Window Ticker**: A live progress ring / countdown bar showing 15:00 counting down in real-time.
5. **Payment Confetti & Rank Takeover Flash**: A brief celebratory particle animation upon successful checkout confirmation.
