"use client";

import * as React from "react";
import { Plus, Minus, Zap } from "lucide-react";

interface HeroStepperProps {
  currentLeaderSpend: number;
  onPriceChange?: (price: number) => void;
}

export function HeroStepper({
  currentLeaderSpend,
  onPriceChange,
}: HeroStepperProps) {
  // To take #1 today, minimum is current leader + 2 (or minimum $5)
  const baseTakeoverPrice = Math.max(5, (currentLeaderSpend || 0) + 2);
  const [targetBid, setTargetBid] = React.useState(baseTakeoverPrice);

  React.useEffect(() => {
    setTargetBid(baseTakeoverPrice);
  }, [baseTakeoverPrice]);

  const handleIncrement = () => {
    const next = targetBid + 1;
    setTargetBid(next);
    onPriceChange?.(next);
  };

  const handleDecrement = () => {
    if (targetBid > baseTakeoverPrice) {
      const next = targetBid - 1;
      setTargetBid(next);
      onPriceChange?.(next);
    }
  };

  return (
    <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto w-full px-2 sm:px-0">
      {/* Zero Auth Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] sm:text-xs font-bold tracking-wide">
        <Zap className="w-3.5 h-3.5" />
        <span>ZERO AUTH • INSTANT PADDLE CHECKOUT</span>
      </div>

      {/* Dynamic Display Headline with Steppers */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] pt-1">
          Claim today&apos;s #1 for
        </h1>

        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-inner shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={targetBid <= baseTakeoverPrice}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Decrease bid amount"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono font-black text-2xl sm:text-5xl text-blue-600 dark:text-blue-400 min-w-[55px] sm:min-w-[100px] text-center">
            ${targetBid}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
            title="Increase bid amount"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto px-2">
        The public leaderboard where products rank strictly by what they pay. Every payment buys 7 days of live visibility.
      </p>
    </div>
  );
}
