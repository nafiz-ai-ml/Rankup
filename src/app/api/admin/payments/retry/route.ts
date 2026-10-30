import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin/auth";
import { updateAdminPayment, getAdminPayments, updateAdminListing } from "@/lib/admin/adminStore";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminSession(sessionToken)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { payment_id } = body;

    if (!payment_id) {
      return NextResponse.json({ error: "Missing payment_id." }, { status: 400 });
    }

    // Live Supabase update
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { data: pmt, error: pmtErr } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("id", payment_id)
        .maybeSingle();

      if (pmtErr) {
        return NextResponse.json({ error: pmtErr.message }, { status: 500 });
      }

      if (pmt) {
        // Execute advisory lock payment processor without pre-setting status
        const { data: result, error: rpcError } = await supabaseAdmin.rpc("process_successful_payment", {
          p_payment_id: pmt.id,
          p_listing_id: pmt.listing_id,
          p_event_id: pmt.paddle_event_id || `manual_retry_${pmt.id}`,
          p_transaction_id: pmt.paddle_transaction_id || `manual_txn_${pmt.id}`,
          p_email: pmt.paddle_customer_email,
          p_paid_minor: pmt.amount_usd * 100,
          p_payload: pmt.raw_payload || {},
        });

        if (rpcError) {
          console.error("RPC error during payment retry:", rpcError);
          return NextResponse.json({ error: rpcError.message || "RPC failed" }, { status: 500 });
        }

        if (result === "not_found") {
          return NextResponse.json({ error: "Payment or listing record not found." }, { status: 404 });
        }
        if (result === "mismatch") {
          return NextResponse.json({ error: "Payment amount mismatch." }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          result,
          message: `Payment re-processed successfully with result: ${result}.`,
        });
      }
    }

    // In-memory fallback
    const payments = getAdminPayments();
    const targetPayment = payments.find((p) => p.id === payment_id);

    if (!targetPayment) {
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
    }

    updateAdminPayment(payment_id, { status: "succeeded" });
    updateAdminListing(targetPayment.listing_id, {
      status: "active",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Payment ${payment_id} marked as succeeded and listing spend synchronized.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to retry payment." },
      { status: 500 }
    );
  }
}
