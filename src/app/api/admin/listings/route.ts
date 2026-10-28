import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin/auth";
import { getAdminListings, updateAdminListing } from "@/lib/admin/adminStore";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const status = searchParams.get("status") || "all";

  try {
    let listings = getAdminListings();

    // Check if Supabase connected
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      let query = supabaseAdmin
        .from("listings")
        .select("*, spend:listing_spend(*), category:categories(*)")
        .order("created_at", { ascending: false });

      if (status !== "all") {
        query = query.eq("status", status);
      }

      const { data } = await query;
      if (data) {
        listings = data;
      }
    }

    // Filter by status if in mock mode
    if (status !== "all") {
      listings = listings.filter((l) => l.status === status);
    }

    // Filter by search query
    if (q) {
      listings = listings.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.destination_url && l.destination_url.toLowerCase().includes(q)) ||
          (l.x_handle && l.x_handle.toLowerCase().includes(q)) ||
          l.id.toLowerCase().includes(q) ||
          l.slug.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ listings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch listings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing listing id." }, { status: 400 });
    }

    // Attempt live Supabase update
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data, error } = await supabaseAdmin
        .from("listings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, listing: data });
      }
    }

    // Fallback store update
    const updated = updateAdminListing(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update listing." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing listing id." }, { status: 400 });
    }

    // Attempt live Supabase soft remove
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      await supabaseAdmin
        .from("listings")
        .update({ status: "removed", updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    // Fallback store update
    updateAdminListing(id, { status: "removed" });

    return NextResponse.json({ success: true, message: "Listing marked as removed." });
  } catch {
    return NextResponse.json({ error: "Failed to remove listing." }, { status: 500 });
  }
}
