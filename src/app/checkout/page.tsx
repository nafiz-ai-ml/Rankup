"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { openPaddleCheckout } from "@/lib/paddle/client";
import { Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get("_ptxn");

  React.useEffect(() => {
    if (!transactionId) {
      router.replace("/");
      return;
    }

    openPaddleCheckout({
      transactionId,
      onSuccess: () => {
        router.replace("/");
      },
      onClose: () => {
        router.replace("/");
      },
    }).catch((err) => {
      console.error("Failed to open Paddle checkout:", err);
      router.replace("/");
    });
  }, [transactionId, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        Opening secure Paddle checkout...
      </p>
      <p className="text-xs text-slate-400">
        Please wait while your payment session loads.
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-400">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}

