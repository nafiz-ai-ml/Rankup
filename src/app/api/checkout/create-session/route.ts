import { NextRequest, NextResponse } from "next/server";
import { generateNormalizedKey } from "@/lib/scraper/extractor";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || `listing-${Date.now()}`;

    let listingId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();

    // 2. Check or upsert listing in Supabase if configured
    const isLiveSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

    if (isLiveSupabase) {
      try {
        // Check if existing listing with normalized_key
        const { data: existing } = await supabaseAdmin
          .from("listings")
          .select("id")
          .eq("normalized_key", normalizedKey)
          .maybeSingle();

        if (existing) {
          listingId = existing.id;
        } else {
          // Insert new listing with status pending_payment
          const { error: insertErr } = await supabaseAdmin.from("listings").insert({
            id: listingId,
            destination_type: destinationType,
            destination_url: destinationType === "website" ? destination : null,
            x_handle: destinationType === "x_profile" ? destination.replace("https://x.com/", "") : null,
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
          }
        }

        // Insert pending payment record
        await supabaseAdmin.from("payments").insert({
          id: paymentId,
          listing_id: listingId,
          amount_usd: parsedAmount,
          status: "pending",
        });
      } catch (dbErr) {
        console.warn("Supabase checkout session write failed, falling back to local session:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      listingId,
      paymentId,
      amountUsd: parsedAmount,
      destination,
      title,
      normalizedKey,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout session creation failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
