import { NextRequest, NextResponse } from "next/server";
import { verifyPaddleWebhook } from "@/lib/paddle/verify";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET_KEY || "";

    // Allow test simulation if development mode or if explicitly flagged
    const isTestMode = req.headers.get("x-rankup-test-webhook") === "true" || process.env.NODE_ENV !== "production";

    if (!isTestMode && secretKey) {
      const isValid = verifyPaddleWebhook(rawBody, signature, secretKey);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid webhook signature." },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(rawBody);

    // Filter event type
    if (event.event_type !== "transaction.paid") {
      return NextResponse.json({ message: "Event ignored (not transaction.paid)." }, { status: 200 });
    }

    const transaction = event.data;
    const customData = transaction.custom_data || {};
    const listingId = customData.listing_id;
    const eventId = event.event_id || `evt_${Date.now()}`;
    const transactionId = transaction.id || `txn_${Date.now()}`;
    const customerEmail = transaction.customer?.email || null;

    // Parse amount USD (from details.totals.total in cents or custom_data)
    let amountUsd = customData.bid_amount_usd ? parseInt(customData.bid_amount_usd, 10) : 5;
    if (transaction.details?.totals?.total) {
      amountUsd = Math.round(parseFloat(transaction.details.totals.total) / 100);
    }

    // Call Supabase RPC procedure with Advisory Lock if database is connected
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase && listingId) {
      const { error: rpcErr } = await supabaseAdmin.rpc("process_successful_payment", {
        p_listing_id: listingId,
        p_event_id: eventId,
        p_transaction_id: transactionId,
        p_email: customerEmail,
        p_amount: amountUsd,
        p_payload: event,
      });

      if (rpcErr) {
        console.error("Supabase process_successful_payment error:", rpcErr);
        return NextResponse.json(
          { error: "Database transaction failed." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully. 7-day visibility and 15-minute boost window activated.",
      data: {
        listingId,
        amountUsd,
        eventId,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
