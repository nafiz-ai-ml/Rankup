"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import { Trophy, ShieldCheck, Clock, ArrowRight, X, Sparkles } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    destination: string;
    amountUsd: number;
    rank: number;
  } | null;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  data,
}: PaymentSuccessModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563EB", "#60A5FA", "#F59E0B", "#10B981"],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0E1424] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 text-center space-y-5 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Payment Confirmed</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            You Claimed Rank #{data.rank}!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate px-4">
            {data.title} is now active on the public leaderboard.
          </p>
        </div>

        {/* Placement Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 space-y-2.5 text-xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Total Spend Paid:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              ${data.amountUsd} USD
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active Visibility:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              7 Full Days
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Merchant of Record:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Paddle Billing
            </span>
          </div>
        </div>

        {/* 15-Minute Boost Window Alert */}
        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>15-Minute Boost Window is ACTIVE!</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            If someone outbids you in the next 15 minutes, you can instantly reclaim your rank by paying only the difference plus $2.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>View On Leaderboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
