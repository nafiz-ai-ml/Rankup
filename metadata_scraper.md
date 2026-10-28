# Rankup — Public Metadata Fetching & Normalization Engine

## 1. Overview & Objectives

When a user submits a website URL or an X (Twitter) profile handle to claim a rank, Rankup must instantly:
1. **Sanitize & Normalize** the destination to prevent duplicates and remove spam tracking parameters.
2. **Scrape Public OpenGraph Metadata** (Title, Short Description, OG Image, High-Resolution Favicon) within 1.5 seconds.
3. **Handle Edge Cases Gracefully** (Bot protection, Cloudflare blocks, missing OG tags) by offering an intuitive manual editing fallback.

---

## 2. URL Normalization & Deduplication Logic

### 2.1 Sanitization Rules (Websites)
* **Strip Tracking & Affiliate Queries**:
  - `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
  - `fbclid`, `gclid`, `msclkid`, `twclid`
  - `ref`, `source`, `aff`, `affiliate`, `tag`
* **Protocol & Trailing Slash Normalization**:
  - Ensure protocol is strictly `http` or `https` (upgrade `http://` to `https://` by default).
  - Convert domain hostname to lower case (`Example.COM` -> `example.com`).
  - Strip unnecessary trailing slash (`example.com/` -> `example.com`).
  - Strip URL hash fragments (`#pricing` -> removed).

### 2.2 Deduplication Key (`normalized_key`)
To guarantee that a product has only **one active placement** on the leaderboard at a time:

```typescript
export function generateNormalizedKey(input: string, type: 'website' | 'x_profile'): string {
  if (type === 'x_profile') {
    // Extract handle: @username, x.com/username, twitter.com/username
    const handle = input
      .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//i, '')
      .replace(/^@/, '')
      .split(/[\/?#]/)[0]
      .toLowerCase()
      .trim();
    return `x:${handle}`;
  }

  // Website type
  const urlObj = new URL(input.startsWith('http') ? input : `https://${input}`);
  const cleanHostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const cleanPathname = urlObj.pathname.replace(/\/+$/, ''); // remove trailing slashes

  return `web:${cleanHostname}${cleanPathname}`;
}
```

#### Duplicate Prevention Policy:
If a query finds an active listing matching `normalized_key`:
* The system stops creation of a duplicate row.
* A friendly message is shown: *"This product already has an active rank! Would you like to Boost its rank instead?"*
* The user is seamlessly directed into the Boost flow for the existing listing.

---

## 3. OpenGraph Scraping Architecture

Scraping runs server-side via a Next.js Server Action or Edge Route (`/api/metadata/scrape`):

```typescript
import { load } from 'cheerio';

export interface ScrapedMetadata {
  title: string;
  description: string;
  imageUrl: string | null;
  faviconUrl: string;
  normalizedKey: string;
}

export async function scrapeWebsiteMetadata(targetUrl: string): Promise<ScrapedMetadata> {
  // 1. Fetch HTML with realistic browser User-Agent
  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RankupBot/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: AbortSignal.timeout(4000), // 4-second hard timeout
  });

  const html = await response.text();
  const $ = load(html);

  // 2. Extract Title with fallback priority
  const title = 
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text().trim() ||
    new URL(targetUrl).hostname;

  // 3. Extract Description with fallback priority
  const description = 
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  // 4. Extract Social Image
  let imageUrl = 
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    null;

  // 5. High-Resolution Favicon Extraction
  let faviconUrl = 
    $('link[rel="apple-touch-icon"]').attr('href') ||
    $('link[rel="icon"][sizes="32x32"]').attr('href') ||
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    '/favicon.ico';

  // Resolve relative URLs to absolute
  const baseUrl = new URL(targetUrl);
  if (faviconUrl && !faviconUrl.startsWith('http')) {
    faviconUrl = new URL(faviconUrl, baseUrl.origin).toString();
  }

  // Ultimate Favicon Fallback using Google's Favicon CDN
  if (!faviconUrl || faviconUrl.endsWith('/favicon.ico')) {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${baseUrl.hostname}&sz=128`;
  }

  return {
    title: title.slice(0, 60), // clamp to 60 characters
    description: description.slice(0, 140), // clamp to 140 characters
    imageUrl,
    faviconUrl,
    normalizedKey: generateNormalizedKey(targetUrl, 'website'),
  };
}
```

---

## 4. X / Twitter Profile Parsing

If the user submits an X handle (`@username` or `x.com/username`):
1. Extract username handle.
2. Attempt extraction via public syndicate API or OpenGraph scrapers.
3. If Twitter anti-bot protection blocks scraping:
   - Provide an instant avatar fallback (default modern avatar or UI generated initials).
   - Pre-fill Title with `@username`.
   - Prompt user: *"You can enter your display name and tagline below before checkout."*

---

## 5. User Edit & Sanitize Verification Screen

Before proceeding to Paddle Checkout, the user is presented with the **Metadata Preview Card**:
* User can edit:
  - **Listing Title** (Text field, maximum 60 characters).
  - **Tagline / Short Description** (Textarea, maximum 140 characters).
* System automatically sanitizes input against XSS, HTML tag injections, and disallowed promo patterns before storing in Supabase.
