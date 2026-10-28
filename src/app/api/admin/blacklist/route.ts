import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin/auth";
import { getAdminBlacklist, addAdminBlacklistItem, removeAdminBlacklistItem } from "@/lib/admin/adminStore";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    let blacklist = getAdminBlacklist();

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data } = await supabaseAdmin
        .from("blacklist")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        blacklist = data;
      }
    }

    return NextResponse.json({ blacklist });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blacklist." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { pattern, type, reason } = body;

    if (!pattern || !type) {
      return NextResponse.json({ error: "Pattern and type are required." }, { status: 400 });
    }

    // Live Supabase insert
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data, error } = await supabaseAdmin
        .from("blacklist")
        .insert({
          pattern: pattern.trim().toLowerCase(),
          type,
          reason: reason || null,
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, item: data });
      }
    }

    // In-memory fallback
    const newItem = addAdminBlacklistItem({
      pattern: pattern.trim().toLowerCase(),
      type,
      reason: reason || null,
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch {
    return NextResponse.json({ error: "Failed to create blacklist item." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing blacklist id." }, { status: 400 });
    }

    // Live Supabase delete
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      await supabaseAdmin.from("blacklist").delete().eq("id", id);
    }

    removeAdminBlacklistItem(id);

    return NextResponse.json({ success: true, message: "Blacklist item removed." });
  } catch {
    return NextResponse.json({ error: "Failed to delete blacklist item." }, { status: 500 });
  }
}
