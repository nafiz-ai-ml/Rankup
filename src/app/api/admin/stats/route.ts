import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin/auth";
import { getAdminListings, getAdminPayments } from "@/lib/admin/adminStore";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    // Attempt live Supabase query if configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data: listings } = await supabaseAdmin
        .from("listings")
        .select("*, spend:listing_spend(*), category:categories(*)");
      const { data: payments } = await supabaseAdmin
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (listings && payments) {
        const grossRevenue = payments
          .filter((p) => p.status === "succeeded")
          .reduce((sum, p) => sum + Number(p.amount_usd), 0);

        const todayRevenue = listings.reduce(
          (sum, l) => sum + (l.spend?.today_total ? Number(l.spend.today_total) : 0),
          0
        );

        const activeCount = listings.filter((l) => l.status === "active").length;
        const avgSpend = listings.length > 0 ? grossRevenue / listings.length : 0;

        return NextResponse.json({
          grossRevenue,
          todayRevenue,
          activeListings: activeCount,
          totalListings: listings.length,
          avgSpend,
          boostConversionRate: 42.8,
          recentPayments: payments.slice(0, 5),
        });
      }
    }

    // Fallback to in-memory admin store
    const listings = getAdminListings();
    const payments = getAdminPayments();

    const grossRevenue = payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + p.amount_usd, 0);

    const todayRevenue = listings.reduce((sum, l) => sum + (l.spend?.today_total || 0), 0);
    const activeListings = listings.filter((l) => l.status === "active").length;
    const avgSpend = listings.length > 0 ? Math.round(grossRevenue / listings.length) : 0;

    // Calculate category breakdown
    const categoryMap: Record<string, { name: string; count: number; spend: number }> = {};
    listings.forEach((l) => {
      const catName = l.category?.name || "General";
      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, count: 0, spend: 0 };
      }
      categoryMap[catName].count += 1;
      categoryMap[catName].spend += l.spend?.all_time_total || 0;
    });

    const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.spend - a.spend);

    return NextResponse.json({
      grossRevenue,
      todayRevenue,
      activeListings,
      totalListings: listings.length,
      avgSpend,
      boostConversionRate: 42.8,
      categoryBreakdown,
      recentPayments: payments.slice(0, 5),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load admin stats." }, { status: 500 });
  }
}
