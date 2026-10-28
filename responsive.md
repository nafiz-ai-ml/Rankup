# Rankup — Responsive & Cross-Device Strategy Specification

## 1. Overview & Breakpoint Standards

A significant portion of viral traffic (especially from X / Twitter and product launches) comes from mobile devices. Rankup must deliver a flawless, high-speed, app-like experience across all screen sizes.

### Standard Breakpoints (Tailwind-compatible)

| Device Tier | Viewport Width | Typical Hardware | Primary Layout Behavior |
|---|---|---|---|
| **Mobile (Compact)** | `< 640px` (`sm`) | iPhone, Galaxy, Android phones | Single column, sticky bottom app bar, slide-out drawer, vertical stacked cards |
| **Tablet (Portrait)** | `640px - 768px` (`md`) | iPad Mini, small tablets | Compact sidebar icon mode or top bar, 2-column stats, compact cards |
| **Tablet (Landscape) / Small Laptop** | `769px - 1024px` (`lg`) | iPad Pro, MacBook Air 11" | Collapsible sidebar (`w-20` icon mode or `w-64`), full claim bar |
| **Desktop (Standard)** | `1025px - 1440px` (`xl`) | Standard Laptops & Desktops | Full sticky left sidebar (`w-64`), multi-column layout with right side-rail |
| **Wide / Ultra-Wide** | `> 1440px` (`2xl`) | Large external monitors | Centered max-width container (`max-w-7xl`), comfortable generous whitespace |

---

## 2. Navigation Adaptation by Device

### 2.1 Desktop (`>= 1024px`)
* **Persistent Left Sidebar**: Fixed position, `260px` width.
* Main content area offset by `margin-left: 260px`.
* Right side-rail for "All-Time Mini Top 10" and "Latest Activity" ticker.

### 2.2 Tablet (`768px - 1023px`)
* **Icon-Only Rail Mode (or Collapsible)**:
  - Sidebar collapses to `w-20` (80px), showing only brand icon and nav icons with tooltips.
  - Clicking a toggle icon expands it into full `260px` width overlay.
* Right side-rail moves underneath the main leaderboard.

### 2.3 Mobile (`< 768px`)
* **Top Header Bar**:
  - Left: `rankup-mark.svg` (icon) + "Rankup" text.
  - Center: Live status indicator (green dot).
  - Right: Hamburger Menu Icon + Theme Switcher.
* **Sticky Bottom Navigation App Bar**:
  - Sticky at the very bottom of the viewport (`fixed bottom-0 left-0 right-0 z-40`).
  - Height: `64px` with glassmorphism blur (`backdrop-blur-lg bg-slate-900/90`).
  - 4 Touch Targets:
    1. 🏠 **Home / Top 10**
    2. ⚡ **Today's Board**
    3. 🗂️ **Categories** (opens bottom sheet)
    4. 🚀 **Claim Rank** (Prominent Electric Blue floating pill button in center/right)
* **Slide-out Navigation Drawer**:
  - Tapping the hamburger menu slides out a full-height menu from the left for secondary pages: Rules, About, Archive, Terms, and Admin.

---

## 3. Component Responsive Adaptation

### 3.1 The Hero Claim Bar

| Screen Size | Layout & Behavior |
|---|---|
| **Desktop** | Single unified horizontal pill bar: `[ Input Field: URL/@handle ] [ Category Dropdown ] [ Claim Rank Button ]` |
| **Tablet** | 2-row layout: Top row has Input Field; Bottom row has Category Dropdown and Action Button side-by-side |
| **Mobile** | Vertically stacked clean form: <br>1. Large touch input field (min-height `48px`)<br>2. Native-feeling category selector sheet<br>3. Full-width primary CTA button with tactile tap feedback |

### 3.2 Leaderboard Card Layout

On desktop, each listing card is a wide horizontal row. On mobile, it re-flows into an ergonomic card to prevent horizontal scrolling:

```text
[ Desktop Row Layout (>= 1024px) ]
+----+ +-------+ +-------------------------------------------+ +------------+ +-------+ +---------+
| #1 | | Favicon| | Product Title - One line description      | | Category   | | $102  | | Outbid  |
|    | | 48x48 | | domain.com • 42 clicks • 3h ago           | | Chip       | | Paid  | | Button  |
+----+ +-------+ +-------------------------------------------+ +------------+ +-------+ +---------+

[ Mobile Card Layout (< 640px) ]
+-------------------------------------------------------------+
| [#1 Gold Badge]  [Category Chip]              [$102 Paid]   |
+-------------------------------------------------------------+
| +-------+  Product Title                                    |
| |Favicon|  domain.com • 42 clicks                           |
| +-------+  Short description of the product goes here...   |
+-------------------------------------------------------------+
| [ Outbid / Boost Button (Full Width, 44px tap target) ]     |
+-------------------------------------------------------------+
```

### 3.3 Dynamic Stepper & Price Calculator
* On touch screens, the `+` and `-` stepper buttons on the hero display headline are enlarged to at least **`44x44px`** tap targets according to Apple HIG and Google Material guidelines.
* Haptic feedback / vibration trigger on mobile devices where supported (`navigator.vibrate(10)`).

### 3.4 Modal & Claim Flow on Mobile
* On desktop: Centered modal dialog with backdrop overlay blur.
* On mobile: Transitions into a **Bottom Sheet Drawer** (`fixed inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl overflow-y-auto`):
  - Pull-down handle bar at the top.
  - Keyboard-aware layout (inputs push content up so the virtual keyboard does not obscure form elements).

### 3.5 Tables & Data Display
* Data tables (Full Leaderboard or Admin) implement horizontal swipe with fixed/sticky first column (Rank & Name stay pinned while spend, dates, and actions scroll horizontally).
* Custom scroll indicators show user that more columns exist.

---

## 4. Performance & Touch Optimization

1. **Touch Targets**: All clickable elements (buttons, chips, pagination pills, links) strictly adhere to a **minimum 44px by 44px touch area**.
2. **Prevent Layout Shifts (CLS)**: Image and favicon containers have explicit aspect ratios (`w-12 h-12` or `aspect-square`) to prevent content jumps while assets load.
3. **No Horizontal Scroll Bug**: Global `overflow-x: hidden` applied to container wrappers; code blocks and wide tables use isolated `overflow-x: auto`.
4. **Fast Touch Response**: Disable standard 300ms mobile tap delay using `touch-action: manipulation`.
