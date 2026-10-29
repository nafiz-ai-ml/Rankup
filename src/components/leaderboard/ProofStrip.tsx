import * as React from "react";
import { Users, DollarSign, Package, ShieldCheck } from "lucide-react";

export function ProofStrip() {
  return (
    <div className="w-full max-w-full space-y-8 sm:space-y-10 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-white/10 overflow-hidden">
      {/* 1. Header statement */}
      <div className="text-center space-y-2 px-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Platform Transparency
        </h3>
        <p className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
          Real numbers behind the <span className="text-blue-500">Rankup</span> leaderboard
        </p>
      </div>

      {/* 2. Big Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto w-full px-2 sm:px-0">
        {/* Visitors */}
        <div className="p-4 sm:p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-bold text-xs sm:text-sm mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />
            <Users className="w-4 h-4" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
            1,240,580
          </div>
          <div className="text-xs text-slate-500 font-medium">total visitors</div>
        </div>

        {/* Revenue */}
        <div className="p-4 sm:p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-blue-500 font-bold text-xs sm:text-sm mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-4xl text-blue-600 dark:text-blue-400">
            $184,490
          </div>
          <div className="text-xs text-slate-500 font-medium">total revenue paid</div>
        </div>

        {/* Products Added */}
        <div className="p-4 sm:p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-purple-500 font-bold text-xs sm:text-sm mb-1">
            <Package className="w-4 h-4" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
            2,450
          </div>
          <div className="text-xs text-slate-500 font-medium">products ranked</div>
        </div>
      </div>

      {/* 3. Mandatory Legal Sponsored Disclosure Badge */}
      <div className="max-w-2xl mx-auto p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-1.5 px-3">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Sponsored Placement Disclosure</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
          Rank is strictly determined by cumulative payment through Paddle, not by editorial review or organic algorithm. Every payment purchases 7 days of active public visibility.
        </p>
      </div>
    </div>
  );
}
