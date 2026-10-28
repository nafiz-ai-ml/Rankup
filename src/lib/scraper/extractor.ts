import * as cheerio from "cheerio";

export interface ScrapedMetadata {
  title: string;
  description: string;
  imageUrl: string | null;
  faviconUrl: string;
  normalizedKey: string;
  destinationType: "website" | "x_profile";
  cleanUrl: string;
  isDuplicate?: boolean;
  existingListingId?: string;
}

const DISALLOWED_DOMAINS = [
  "t.me",
  "telegram.me",
  "wa.me",
  "chat.whatsapp.com",
  "discord.gg",
  "discord.com/invite",
  "bit.ly",
  "tinyurl.com",
  "cutt.ly",
];

export function generateNormalizedKey(input: string, type: "website" | "x_profile"): string {
  if (type === "x_profile") {
    const handle = input
      .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//i, "")
      .replace(/^@/, "")
      .split(/[\/?#]/)[0]
      .toLowerCase()
      .trim();
    return `x:${handle}`;
  }

  try {
    const formattedUrl = input.startsWith("http://") || input.startsWith("https://")
      ? input
      : `https://${input}`;
    const urlObj = new URL(formattedUrl);
    const cleanHostname = urlObj.hostname.toLowerCase().replace(/^www\./, "");
    const cleanPathname = urlObj.pathname.replace(/\/+$/, "");
    return `web:${cleanHostname}${cleanPathname}`;
  } catch {
    return `web:${input.toLowerCase().trim()}`;
  }
}

export function sanitizeDestination(rawInput: string): {
  cleanUrl: string;
  type: "website" | "x_profile";
  error?: string;
} {
  const trimmed = rawInput.trim();

  // Check if X/Twitter handle
  if (
    trimmed.startsWith("@") ||
    /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//i.test(trimmed)
  ) {
    const handle = trimmed
      .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//i, "")
      .replace(/^@/, "")
      .split(/[\/?#]/)[0]
      .trim();

    if (!handle || handle.length > 30) {
      return { cleanUrl: trimmed, type: "x_profile", error: "Invalid X profile handle." };
    }

    return {
      cleanUrl: `https://x.com/${handle}`,
      type: "x_profile",
    };
  }

  // Website URL processing
  try {
    const urlWithProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;

    const urlObj = new URL(urlWithProtocol);

    // Validate hostname
    const host = urlObj.hostname.toLowerCase();
    for (const banned of DISALLOWED_DOMAINS) {
      if (host === banned || host.endsWith(`.${banned}`)) {
        return {
          cleanUrl: trimmed,
          type: "website",
          error: `Direct invite links and URL shorteners (${banned}) are prohibited.`,
        };
      }
    }

    // Strip tracking parameters
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "msclkid",
      "twclid",
      "ref",
      "source",
      "aff",
      "affiliate",
      "tag",
    ];

    trackingParams.forEach((param) => urlObj.searchParams.delete(param));
    urlObj.hash = "";

    return {
      cleanUrl: urlObj.toString().replace(/\/+$/, ""),
      type: "website",
    };
  } catch {
    return {
      cleanUrl: trimmed,
      type: "website",
      error: "Please enter a valid website URL or X handle.",
    };
  }
}

export async function scrapePublicMetadata(rawInput: string): Promise<ScrapedMetadata> {
  const { cleanUrl, type, error } = sanitizeDestination(rawInput);
  if (error) {
    throw new Error(error);
  }

  const normalizedKey = generateNormalizedKey(cleanUrl, type);

  // If X profile:
  if (type === "x_profile") {
    const handle = cleanUrl.replace("https://x.com/", "");
    return {
      title: `@${handle} on X`,
      description: `Official X profile of @${handle}. Claimed on Rankup leaderboard.`,
      imageUrl: null,
      faviconUrl: "https://abs.twimg.com/favicons/twitter.3.ico",
      normalizedKey,
      destinationType: "x_profile",
      cleanUrl,
    };
  }

  // Website scraping
  try {
    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RankupBot/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(4000), // 4-second timeout
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text().trim() ||
      new URL(cleanUrl).hostname;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const imageUrl =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    let faviconUrl =
      $('link[rel="apple-touch-icon"]').attr("href") ||
      $('link[rel="icon"][sizes="32x32"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    const baseUrl = new URL(cleanUrl);
    if (faviconUrl && !faviconUrl.startsWith("http")) {
      try {
        faviconUrl = new URL(faviconUrl, baseUrl.origin).toString();
      } catch {
        faviconUrl = "";
      }
    }

    // Google Favicon CDN fallback
    if (!faviconUrl || faviconUrl.endsWith("/favicon.ico")) {
      faviconUrl = `https://www.google.com/s2/favicons?domain=${baseUrl.hostname}&sz=128`;
    }

    return {
      title: title.slice(0, 60),
      description: description.slice(0, 140),
      imageUrl,
      faviconUrl,
      normalizedKey,
      destinationType: "website",
      cleanUrl,
    };
  } catch (err) {
    // If site blocks bot or times out, provide clean domain fallback
    const hostname = new URL(cleanUrl).hostname.replace(/^www\./, "");
    return {
      title: hostname,
      description: `Official website for ${hostname}`,
      imageUrl: null,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
      normalizedKey,
      destinationType: "website",
      cleanUrl,
    };
  }
}
