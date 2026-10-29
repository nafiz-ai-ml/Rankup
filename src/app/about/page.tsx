"use client";

import * as React from "react";
import Link from "next/link";
import {
  Info,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  MousePointerClick,
  CheckCircle2,
} from "lucide-react";
import { useClaimModal } from "@/context/ClaimModalContext";

export default function AboutAndStatsPage() {
  const { openClaimModal } = useClaimModal();

  return (
    <div className="flex flex-col gap-10 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>TRANSPARENCY MANIFESTO & LIVE METRICS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Honest, Paid-Only Visibility for Modern Builders
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The internet is flooded with pay-to-play directories masquerading as &quot;organic&quot; communities. Rankup removes all hypocrisy: here, rankings are determined by pure mathematical transparency.
          </p>
        </div>
      </div>

      {/* Live Financial & Platform Metrics Grid */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            Live Platform Economics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time aggregate data collected across all 20 categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-blue-500">
              <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">
              $184,490
            </div>
            <div className="text-[11px] text-slate-400 font-medium">processed via Paddle</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-emerald-500">
              <span className="text-xs font-semibold text-slate-400">Total Visitors</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              1,240,580
            </div>
            <div className="text-[11px] text-slate-400 font-medium">unique pageviews</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-purple-500">
              <span className="text-xs font-semibold text-slate-400">Products Ranked</span>
              <Package className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              2,450
            </div>
            <div className="text-[11px] text-slate-400 font-medium">SaaS, AI & Creators</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-semibold text-slate-400">Average CTR</span>
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400">
              4.8%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">clicks to external site</div>
          </div>
        </div>
      </div>

      {/* Why Rankup? The Manifesto */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Why We Built Rankup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              The Broken State of Product Discovery
            </h3>
            <p>
              Traditional launch directories pretend to be meritocratic. In reality, the top spots are dominated by upvote syndicates, agency launch rings, and hidden sponsorship deals. As an indie builder or emerging startup, you are competing against unfair gaming.
            </p>
            <p>
              Rankup strips away the illusion. We created a 100% transparent marketplace where visibility is purely mathematical: pay more, rank higher.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Zero Auth, Instant Checkout
            </h3>
            <p>
              We believe in extreme efficiency. You do not need to create an account, verify an email, or remember another password. You simply enter your URL or X handle, select a bid amount, and complete checkout with Paddle.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No password or account creation required</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant metadata scraping via Cheerio</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Guaranteed 7 days of live public visibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold">
            Ready to claim your spot?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Join 2,450+ founders who rank their products on Rankup. Starting at just $5 with instant activation.
          </p>
        </div>

        <button
          onClick={() => openClaimModal()}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>Claim a Rank Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

