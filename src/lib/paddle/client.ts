"use client";

import { initializePaddle, CheckoutEventNames, type Paddle } from "@paddle/paddle-js";

interface Handlers {
  onSuccess?: () => void;
  onClose?: () => void;
}

let handlers: Handlers = {};
let paddlePromise: Promise<Paddle | undefined> | null = null;

function getPaddle() {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      eventCallback: (event) => {
        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) handlers.onSuccess?.();
        if (event.name === CheckoutEventNames.CHECKOUT_CLOSED) handlers.onClose?.();
      },
    });
  }
  return paddlePromise;
}

export async function openPaddleCheckout(opts: { transactionId: string } & Handlers) {
  handlers = { onSuccess: opts.onSuccess, onClose: opts.onClose };
  const paddle = await getPaddle();
  if (!paddle) throw new Error("Failed to load Paddle.js.");

  paddle.Checkout.open({
    transactionId: opts.transactionId,
    settings: { displayMode: "overlay", theme: "dark", locale: "en" },
  });
}
