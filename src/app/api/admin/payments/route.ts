import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin/auth";
import { getAdminPayments } from "@/lib/admin/adminStore";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    let payments = getAdminPayments();

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data } = await supabaseAdmin
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        payments = data;
      }
    }

    return NextResponse.json({ payments });
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments." }, { status: 500 });
  }
}
