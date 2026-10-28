import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/lib/mockData";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let destinationUrl = "https://rankup.lol";

    // 1. Check in mockData
    const mockListing = MOCK_LISTINGS.find((item) => item.id === id || item.slug === id);
    if (mockListing && mockListing.destination_url) {
      mockListing.click_count = (mockListing.click_count || 0) + 1;
      destinationUrl = mockListing.destination_url;
    }

    // 2. Check and increment in Supabase if live
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      try {
        const { data } = await supabaseAdmin
          .from("listings")
          .select("id, destination_url, click_count")
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();

        if (data && data.destination_url) {
          destinationUrl = data.destination_url;
          await supabaseAdmin
            .from("listings")
            .update({ click_count: (data.click_count || 0) + 1 })
            .eq("id", data.id);
        }
      } catch (err) {
        console.warn("Supabase click tracker fallback:", err);
      }
    }

    return NextResponse.redirect(destinationUrl, { status: 302 });
  } catch (error) {
    console.error("Click tracker redirect error:", error);
    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  }
}
