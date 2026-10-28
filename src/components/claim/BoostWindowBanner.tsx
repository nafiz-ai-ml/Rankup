"use client";

import * as React from "react";
import { ShieldCheck, AlertTriangle, ArrowRight, X, Sparkles, RefreshCw } from "lucide-react";
import { useClaimModal } from "@/context/ClaimModalContext";

interface BoostWindowBannerProps {
  expiresAt: Date | null;
  listingTitle: string;
  currentRank: number;
  outbidPrice?: number;
  onDismiss: () => void;
}

export function BoostWindowBanner({
  expiresAt,
  listingTitle,
  currentRank,
  outbidPrice = 4,
  onDismiss,
}: BoostWindowBannerProps) {
  const { openClaimModal } = useClaimModal();
  const [timeLeft, setTimeLeft] = React.useState<string>("15:00");
  const [isOutbid, setIsOutbid] = React.useState(false);
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (!expiresAt) return;

    function tick() {
      const now = Date.now();
      const diffMs = expiresAt!.getTime() - now;

      if (diffMs <= 0) {
        setTimeLeft("00:00");
        setIsExpired(true);
        return;
      }

      const minutes = Math.floor(diffMs / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimeLeft(`${pad(minutes)}:${pad(seconds)}`);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt || isExpired) return null;

  const handleReclaimClick = () => {
    openClaimModal({
      destination: listingTitle,
      bidAmount: outbidPrice,
    });
  };

  return (
    <div className="fixed top-16 lg:top-4 right-4 left-4 lg:left-auto lg:w-[480px] z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        className={`relative p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all ${
          isOutbid
            ? "bg-red-950/90 border-red-500/50 text-white shadow-red-500/20"
            : "bg-slate-900/90 dark:bg-[#0E1424]/95 border-purple-500/40 text-white shadow-purple-500/20"
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
            {isOutbid ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-amber-400">Outbid Alert!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400">Boost Window Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-amber-300">
              {timeLeft}
            </span>
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Content Body */}
        <div className="pt-2.5 space-y-2.5">
          {isOutbid ? (
            <div>
              <p className="text-xs text-slate-200">
                You were just outbid for Rank #{currentRank}! Reclaim your spot with your <strong>+$2 Boost Privilege</strong>:
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  Pay only ${outbidPrice} USD
                </span>
                <button
                  onClick={handleReclaimClick}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Reclaim Rank #{currentRank}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>{listingTitle}</strong> is secured at <strong>Rank #{currentRank}</strong>. If anyone outbids you in the next 15 minutes, you can reclaim with a discounted bid.
              </p>
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-purple-300">
                  <Sparkles className="w-3 h-3" /> Real-time outbid detection live
                </span>
                {/* Simulation button for demo testing */}
                <button
                  type="button"
                  onClick={() => setIsOutbid(true)}
                  className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
                >
                  Test Outbid Alert
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
