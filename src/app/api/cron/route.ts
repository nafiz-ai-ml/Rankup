import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAdminListings } from "@/lib/admin/adminStore";

export async function GET(request: Request) {
  return handleCron(request);
}

export async function POST(request: Request) {
  return handleCron(request);
}

async function handleCron(request: Request) {
  // Verify Bearer token or secret query param
  const authHeader = request.headers.get("authorization");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");

  const expectedSecret = process.env.CRON_SECRET || "rankup_cron_secret_key_2026";
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (bearerToken !== expectedSecret && querySecret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized. Valid CRON_SECRET is required." },
      { status: 401 }
    );
  }

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  let archivedCount = 0;
  let resetCount = 0;

  try {
    // 1. Live Supabase Postgres Execution
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      // Expiry Worker: mark active listings with expires_at <= now() as 'archived'
      const { data: expired, error: expError } = await supabaseAdmin
        .from("listings")
        .update({ status: "archived", updated_at: now.toISOString() })
        .eq("status", "active")
        .lte("expires_at", now.toISOString())
        .select("id");

      if (!expError && expired) {
        archivedCount = expired.length;
      }

      // Daily UTC Reset Worker: reset today_total = 0 where today_date < current_date
      const { data: resets, error: resError } = await supabaseAdmin
        .from("listing_spend")
        .update({ today_total: 0, today_date: todayStr, updated_at: now.toISOString() })
        .lt("today_date", todayStr)
        .select("listing_id");

      if (!resError && resets) {
        resetCount = resets.length;
      }

      return NextResponse.json({
        success: true,
        execution_time: now.toISOString(),
        workers: {
          expiry_worker: {
            status: "completed",
            archived_listings_count: archivedCount,
            rule: "status = 'archived' where status = 'active' and expires_at <= now()",
          },
          daily_utc_reset_worker: {
            status: "completed",
            reset_count: resetCount,
            today_date: todayStr,
            rule: "today_total = 0 where today_date < current_date",
          },
        },
      });
    }

    // 2. Fallback memory worker
    const listings = getAdminListings();
    listings.forEach((l) => {
      // Expiry check
      if (l.status === "active" && l.expires_at && new Date(l.expires_at) <= now) {
        l.status = "archived";
        l.updated_at = now.toISOString();
        archivedCount++;
      }

      // Reset check
      if (l.spend && l.spend.today_date < todayStr) {
        l.spend.today_total = 0;
        l.spend.today_date = todayStr;
        resetCount++;
      }
    });

    return NextResponse.json({
      success: true,
      mode: "local_memory_worker",
      execution_time: now.toISOString(),
      workers: {
        expiry_worker: {
          status: "completed",
          archived_listings_count: archivedCount,
          rule: "status = 'archived' where status = 'active' and expires_at <= now()",
        },
        daily_utc_reset_worker: {
          status: "completed",
          reset_count: resetCount,
          today_date: todayStr,
          rule: "today_total = 0 where today_date < current_date",
        },
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron execution failed." },
      { status: 500 }
    );
  }
}
