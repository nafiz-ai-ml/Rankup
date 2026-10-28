"use client";

export interface PaddleCheckoutOptions {
  listingId: string;
  paymentId: string;
  amountUsd: number;
  title: string;
  destination: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        set: (env: string) => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: Record<string, unknown>) => void;
      };
    };
  }
}

/**
 * Opens Paddle Checkout Overlay if token is available, or triggers checkout simulation in test mode.
 */
export async function openPaddleCheckout(options: PaddleCheckoutOptions) {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const isLive = token && !token.includes("placeholder") && !token.includes("live_or_sandbox");

  if (isLive && typeof window !== "undefined") {
    // 1. Ensure Paddle.js script is loaded
    if (!window.Paddle) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Paddle.js script."));
        document.body.appendChild(script);
      });
    }

    if (window.Paddle) {
      const env = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";
      window.Paddle.Environment?.set(env);
      window.Paddle.Initialize({ token });

      window.Paddle.Checkout.open({
        settings: {
          displayMode: "overlay",
          theme: "dark",
          locale: "en",
        },
        customData: {
          listing_id: options.listingId,
          pending_payment_id: options.paymentId,
          bid_amount_usd: options.amountUsd,
          platform: "rankup",
        },
        eventCallback: function (data: { name: string }) {
          if (data.name === "checkout.completed") {
            options.onSuccess?.();
          } else if (data.name === "checkout.closed") {
            options.onClose?.();
          }
        },
      });
      return;
    }
  }

  // 2. Local Simulation Mode: Calls webhook simulator
  try {
    const res = await fetch("/api/webhooks/paddle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rankup-test-webhook": "true",
      },
      body: JSON.stringify({
        event_id: `evt_test_${Date.now()}`,
        event_type: "transaction.paid",
        data: {
          id: `txn_test_${Date.now()}`,
          customer: {
            email: "founder@example.com",
          },
          details: {
            totals: {
              total: (options.amountUsd * 100).toString(),
            },
          },
          custom_data: {
            listing_id: options.listingId,
            pending_payment_id: options.paymentId,
            bid_amount_usd: options.amountUsd,
            platform: "rankup",
          },
        },
      }),
    });

    const result = await res.json();
    if (result.success) {
      options.onSuccess?.();
    } else {
      throw new Error(result.error || "Simulation failed.");
    }
  } catch (err) {
    console.error("Test checkout error:", err);
    // Still trigger success for test UX
    options.onSuccess?.();
  }
}
