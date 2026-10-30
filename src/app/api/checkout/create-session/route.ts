import { NextRequest, NextResponse } from "next/server";
import { generateNormalizedKey } from "@/lib/scraper/extractor";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { paddle } from "@/lib/paddle/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      destination,
      type,
      title,
      description,
      faviconUrl,
      categoryId,
      bidAmount,
    } = body;

    // 1. Validation
    if (!destination || !title || !categoryId || !bidAmount) {
      return NextResponse.json(
        { error: "Missing required checkout parameters." },
        { status: 400 }
      );
    }

    const parsedAmount = parseInt(bidAmount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 5 || parsedAmount > 99999) {
      return NextResponse.json(
        { error: "Bid amount must be a whole dollar between $5 and $99,999." },
        { status: 400 }
      );
    }

    const destinationType = type === "x_profile" ? "x_profile" : "website";
    const normalizedKey = generateNormalizedKey(destination, destinationType);
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40) || `listing-${Date.now()}`;

    let listingId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();

    // 2. Check blacklist and check/upsert listing in Supabase
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      // Check blacklist
      const { data: blacklistItems, error: blError } = await supabaseAdmin
        .from("blacklist")
        .select("pattern");

      if (blError) {
        console.error("Blacklist check error:", blError);
        return NextResponse.json(
          { error: "Failed to verify platform security rules." },
          { status: 500 }
        );
      }

      if (blacklistItems && blacklistItems.length > 0) {
        const destLower = destination.toLowerCase();
        const keyLower = normalizedKey.toLowerCase();
        const isBlacklisted = blacklistItems.some((item) => {
          const pat = item.pattern.toLowerCase().trim();
          return pat && (destLower.includes(pat) || keyLower.includes(pat));
        });

        if (isBlacklisted) {
          return NextResponse.json(
            { error: "This destination or domain has been blacklisted and cannot be submitted." },
            { status: 400 }
          );
        }
      }

      // Check if existing listing with normalized_key
      const { data: existing, error: existingErr } = await supabaseAdmin
        .from("listings")
        .select("id, status")
        .eq("normalized_key", normalizedKey)
        .maybeSingle();

      if (existingErr) {
        console.error("Listing query error:", existingErr);
        return NextResponse.json(
          { error: "Database query failed." },
          { status: 500 }
        );
      }

      if (existing) {
        if (existing.status === "removed") {
          return NextResponse.json(
            { error: "This listing has been removed by platform moderation and cannot be boosted." },
            { status: 400 }
          );
        }
        listingId = existing.id;
      } else {
        // Insert new listing with status pending_payment
        const { error: insertErr } = await supabaseAdmin.from("listings").insert({
          id: listingId,
          destination_type: destinationType,
          destination_url: destinationType === "website" ? destination : null,
          x_handle:
            destinationType === "x_profile"
              ? destination.replace("https://x.com/", "")
              : null,
          normalized_key: normalizedKey,
          slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
          title: title.slice(0, 60),
          short_description: description ? description.slice(0, 140) : null,
          favicon_url: faviconUrl,
          category_id: categoryId,
          status: "pending_payment",
        });

        if (insertErr) {
          console.error("Listing insert error:", insertErr);
          return NextResponse.json(
            { error: "Failed to create listing in database." },
            { status: 500 }
          );
        }
      }

      // Insert pending payment record
      const { error: pmtErr } = await supabaseAdmin.from("payments").insert({
        id: paymentId,
        listing_id: listingId,
        amount_usd: parsedAmount,
        status: "pending",
      });

      if (pmtErr) {
        console.error("Payment insert error:", pmtErr);
        return NextResponse.json(
          { error: "Failed to create pending payment record." },
          { status: 500 }
        );
      }
    }

    // 3. Create Paddle custom transaction
    const productId = process.env.PADDLE_PRODUCT_ID;
    if (!productId) {
      console.error("Missing PADDLE_PRODUCT_ID environment variable.");
      return NextResponse.json(
        { error: "Paddle payment gateway is not properly configured (missing product ID)." },
        { status: 500 }
      );
    }

    const txn = await paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            name: "Rankup 7-day placement",
            description: `${title.slice(0, 60)} (bid $${parsedAmount})`,
            productId: productId,
            unitPrice: { amount: String(parsedAmount * 100), currencyCode: "USD" },
            quantity: { minimum: 1, maximum: 1 },
            taxMode: "internal",
          },
        },
      ],
      currencyCode: "USD",
      customData: { listing_id: listingId, payment_id: paymentId, platform: "rankup" },
    });

    return NextResponse.json({
      success: true,
      listingId,
      paymentId,
      transactionId: txn.id,
      amountUsd: parsedAmount,
      destination,
      title,
      normalizedKey,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout session creation failed.";
    console.error("Checkout session error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
