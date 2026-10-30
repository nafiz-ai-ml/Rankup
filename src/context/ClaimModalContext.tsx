"use client";

import * as React from "react";
import { ClaimModal } from "@/components/claim/ClaimModal";
import { PaymentSuccessModal } from "@/components/claim/PaymentSuccessModal";
import { BoostWindowBanner } from "@/components/claim/BoostWindowBanner";
import { MOCK_CATEGORIES, MOCK_LISTINGS } from "@/lib/mockData";
import { openPaddleCheckout } from "@/lib/paddle/client";

interface ClaimModalOptions {
  destination?: string;
  categoryId?: string;
  bidAmount?: number;
}

interface BoostWindowState {
  expiresAt: Date;
  title: string;
  rank: number;
}

interface ClaimModalContextType {
  openClaimModal: (options?: ClaimModalOptions) => void;
  closeClaimModal: () => void;
  isOpen: boolean;
  activateBoostWindow: (title: string, rank: number) => void;
}

async function waitForPayment(paymentId: string, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetch(`/api/checkout/status?paymentId=${paymentId}`, { cache: "no-store" });
    const j = await r.json();
    if (j.status === "succeeded") return true;
    await new Promise((res) => setTimeout(res, 1500));
  }
  return false;
}

const ClaimModalContext = React.createContext<ClaimModalContextType | undefined>(undefined);

export function ClaimModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [initialDestination, setInitialDestination] = React.useState("");
  const [initialCategoryId, setInitialCategoryId] = React.useState("");

  // Payment Success Modal State
  const [successData, setSuccessData] = React.useState<{
    title: string;
    destination: string;
    amountUsd: number;
    rank: number;
    pendingConfirmation?: boolean;
  } | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  // 15-Minute Boost Window State
  const [boostWindow, setBoostWindow] = React.useState<BoostWindowState | null>(null);

  const openClaimModal = (options?: ClaimModalOptions) => {
    if (options?.destination) setInitialDestination(options.destination);
    if (options?.categoryId) setInitialCategoryId(options.categoryId);
    setIsOpen(true);
  };

  const closeClaimModal = () => {
    setIsOpen(false);
  };

  const activateBoostWindow = (title: string, rank: number) => {
    setBoostWindow({
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      title,
      rank,
    });
  };

  const handleProceedToCheckout = async (data: {
    destination: string;
    type: "website" | "x_profile";
    title: string;
    description: string;
    faviconUrl: string;
    categoryId: string;
    bidAmount: number;
    targetRank: number;
  }) => {
    try {
      // 1. Create checkout session on server
      const sessionRes = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const sessionData = await sessionRes.json();
      if (!sessionData.success) {
        throw new Error(sessionData.error || "Failed to create checkout session.");
      }

      // 2. Open Paddle Checkout
      await openPaddleCheckout({
        transactionId: sessionData.transactionId,
        onSuccess: async () => {
          closeClaimModal();
          const confirmed = await waitForPayment(sessionData.paymentId);
          setSuccessData({
            title: data.title,
            destination: data.destination,
            amountUsd: data.bidAmount,
            rank: data.targetRank,
            pendingConfirmation: !confirmed,
          });
          setIsSuccessModalOpen(true);
          // Activate the 15-Minute Boost Window
          activateBoostWindow(data.title, data.targetRank);
        },
        onClose: () => {
          console.log("Checkout closed by user.");
        },
      });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Payment initialization failed.");
    }
  };

  return (
    <ClaimModalContext.Provider
      value={{ openClaimModal, closeClaimModal, isOpen, activateBoostWindow }}
    >
      {children}

      {/* 15-Minute Boost Window Floating Banner */}
      {boostWindow && (
        <BoostWindowBanner
          expiresAt={boostWindow.expiresAt}
          listingTitle={boostWindow.title}
          currentRank={boostWindow.rank}
          onDismiss={() => setBoostWindow(null)}
        />
      )}

      {/* Claim Rank Modal */}
      <ClaimModal
        isOpen={isOpen}
        onClose={closeClaimModal}
        categories={MOCK_CATEGORIES}
        initialDestination={initialDestination}
        initialCategoryId={initialCategoryId}
        currentListings={MOCK_LISTINGS}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Celebratory Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        data={successData}
      />
    </ClaimModalContext.Provider>
  );
}

export function useClaimModal() {
  const context = React.useContext(ClaimModalContext);
  if (!context) {
    throw new Error("useClaimModal must be used within a ClaimModalProvider");
  }
  return context;
}
