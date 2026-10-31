import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const board = searchParams.get("board") === "today" ? "today" : "all-time";
  const categoryParam = searchParams.get("category");
  const slugParam = searchParams.get("slug");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const offset = (page - 1) * limit;

  try {
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (!isLiveSupabase) {
      return NextResponse.json({
        listings: [],
        totalCount: 0,
        page,
        limit,
        totalPages: 0,
        todayLeaderSpend: 0,
        allTimeLeaderSpend: 0,
      });
    }

    const todayDate = new Date().toISOString().split("T")[0];

    // 1. Single listing lookup by slug or id
    if (slugParam) {
      const { data: item, error: singleErr } = await supabaseAdmin
        .from("listings")
        .select("*, spend:listing_spend(*), category:categories(*)")
        .or(`slug.eq.${slugParam},id.eq.${slugParam}`)
        .maybeSingle();

      if (singleErr) {
        return NextResponse.json({ error: singleErr.message }, { status: 500 });
      }

      if (!item) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }

      const listing = {
        ...item,
        spend: Array.isArray(item.spend) ? item.spend[0] : item.spend,
        category: Array.isArray(item.category) ? item.category[0] : item.category,
      };

      return NextResponse.json({ listing }, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    // 2. Fetch active listings
    let query = supabaseAdmin
      .from("listings")
      .select("*, spend:listing_spend(*), category:categories(*)")
      .eq("status", "active");

    const { data, error } = await query;

    if (error) {
      console.error("Listings query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let allActiveListings = (data || []).map((item) => ({
      ...item,
      spend: Array.isArray(item.spend) ? item.spend[0] : item.spend,
      category: Array.isArray(item.category) ? item.category[0] : item.category,
    }));

    // Filter by category if specified
    if (categoryParam) {
      allActiveListings = allActiveListings.filter(
        (l) => l.category_id === categoryParam || l.category?.slug === categoryParam
      );
    }

    // Compute top spends for steppers
    const todayActive = allActiveListings
      .filter((l) => l.spend?.today_date === todayDate && (l.spend?.today_total ?? 0) > 0)
      .sort((a, b) => (b.spend?.today_total ?? 0) - (a.spend?.today_total ?? 0));

    const allTimeActive = [...allActiveListings].sort(
      (a, b) => (b.spend?.all_time_total ?? 0) - (a.spend?.all_time_total ?? 0)
    );

    const todayLeaderSpend = todayActive[0]?.spend?.today_total ?? 0;
    const allTimeLeaderSpend = allTimeActive[0]?.spend?.all_time_total ?? 0;

    let targetListings = board === "today" ? todayActive : allTimeActive;

    // Assign ranking numbers: 1, 2, 3...
    targetListings = targetListings.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    const totalCount = targetListings.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const paginatedListings = targetListings.slice(offset, offset + limit);

    return NextResponse.json(
      {
        listings: paginatedListings,
        totalCount,
        page,
        limit,
        totalPages,
        todayLeaderSpend,
        allTimeLeaderSpend,
        todayDate,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err: unknown) {
    console.error("Listings API handler error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

