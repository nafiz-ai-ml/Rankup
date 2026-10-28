import { NextRequest, NextResponse } from "next/server";
import { scrapePublicMetadata } from "@/lib/scraper/extractor";
import { MOCK_LISTINGS } from "@/lib/mockData";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const destination = body.destination;

    if (!destination || typeof destination !== "string") {
      return NextResponse.json(
        { error: "Destination URL or @handle is required." },
        { status: 400 }
      );
    }

    // 1. Scrape metadata & normalize key
    const metadata = await scrapePublicMetadata(destination);

    // 2. Check for duplicate active listing
    let existingListing = null;

    // First check mockData fallback
    const mockMatch = MOCK_LISTINGS.find(
      (item) => item.normalized_key === metadata.normalizedKey && item.status === "active"
    );
    if (mockMatch) {
      existingListing = mockMatch;
    }

    // Then check Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      try {
        const { data } = await supabaseAdmin
          .from("listings")
          .select("id, title, slug, status, expires_at")
          .eq("normalized_key", metadata.normalizedKey)
          .eq("status", "active")
          .maybeSingle();

        if (data) {
          existingListing = data;
        }
      } catch (dbErr) {
        console.warn("Supabase query fallback to mock:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      metadata: {
        ...metadata,
        isDuplicate: !!existingListing,
        existingListingId: existingListing?.id || undefined,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to extract metadata.";
    return NextResponse.json({ success: false, error: message }, { status: 422 });
  }
}
