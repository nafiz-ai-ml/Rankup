import { NextRequest, NextResponse } from "next/server";
import { EventName } from "@paddle/paddle-node-sdk";
import { paddle } from "@/lib/paddle/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // never JSON.parse before verifying
  const signature = req.headers.get("paddle-signature") ?? "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature); // note: await
  } catch (err) {
    console.error("Paddle signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!event) return NextResponse.json({ error: "Bad event" }, { status: 400 });

  if (event.eventType !== EventName.TransactionPaid) {
    return NextResponse.json({ message: "ignored" }, { status: 200 });
  }

  const txn = event.data;
  const cd = (txn.customData ?? {}) as { listing_id?: string; payment_id?: string };
  if (!cd.listing_id || !cd.payment_id) {
    console.error("Missing custom_data on txn", txn.id);
    return NextResponse.json({ message: "no custom_data" }, { status: 200 });
  }

  let email: string | null = null;
  if (txn.customerId) {
    try {
      email = (await paddle.customers.get(txn.customerId)).email;
    } catch {}
  }

  const paidMinor =
    txn.currencyCode === "USD" ? Number(txn.details?.totals?.total ?? 0) : 0;

  const { data: result, error } = await supabaseAdmin.rpc("process_successful_payment", {
    p_payment_id: cd.payment_id,
    p_listing_id: cd.listing_id,
    p_event_id: event.eventId,
    p_transaction_id: txn.id,
    p_email: email,
    p_paid_minor: paidMinor,
    p_payload: JSON.parse(rawBody),
  });

  if (error) {
    console.error("DB error:", error);
    return NextResponse.json({ error: "DB failed" }, { status: 500 }); // lets Paddle retry
  }
  if (result === "mismatch" || result === "not_found") {
    console.error("Payment rejected:", result, txn.id);
  }
  return NextResponse.json({ result }, { status: 200 });
}
