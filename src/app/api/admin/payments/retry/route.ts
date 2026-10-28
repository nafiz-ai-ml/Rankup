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
      const { data: pmt } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("id", payment_id)
        .single();

      if (pmt) {
        // Mark payment as succeeded
        await supabaseAdmin
          .from("payments")
          .update({ status: "succeeded" })
          .eq("id", payment_id);

        // Execute advisory lock payment processor
        await supabaseAdmin.rpc("process_successful_payment", {
          p_listing_id: pmt.listing_id,
          p_amount: pmt.amount_usd,
          p_paddle_event_id: pmt.paddle_event_id || `manual_retry_${Date.now()}`,
          p_paddle_txn_id: pmt.paddle_transaction_id || `manual_txn_${Date.now()}`,
          p_email: pmt.paddle_customer_email,
          p_raw_payload: pmt.raw_payload || {},
        });

        return NextResponse.json({
          success: true,
          message: "Payment re-processed successfully via process_successful_payment.",
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
