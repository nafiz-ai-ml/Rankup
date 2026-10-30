import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("paymentId");
  if (!id) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("payments")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  return NextResponse.json(
    { status: data?.status ?? "unknown" },
    { headers: { "Cache-Control": "no-store" } }
  );
}

