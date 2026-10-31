"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Info,
  DollarSign,
  Users,
  Package,
  MousePointerClick,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useClaimModal } from "@/context/ClaimModalContext";

// Simple SVG Icons for X (Twitter) and LinkedIn
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function AboutAndStatsPage() {
  const { openClaimModal } = useClaimModal();

  /*
   * ==============================================================================
   * FOUNDER SOCIAL LINKS
   * ==============================================================================
   * You can update your official X and LinkedIn URLs here:
   */
  const FOUNDER_X_URL = "https://x.com/nafiz_dev"; // <-- UPDATE YOUR X (TWITTER) URL HERE
  const FOUNDER_LINKEDIN_URL = "https://linkedin.com/in/nafiz-dev"; // <-- UPDATE YOUR LINKEDIN URL HERE

  return (
    <div className="flex flex-col gap-10 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* 1. Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>TRANSPARENCY MANIFESTO & FOUNDER VISION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Honest, Paid-Only Visibility for Modern Builders
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The internet is flooded with pay-to-play directories masquerading as &quot;organic&quot; communities. RankUp removes all hypocrisy: here, rankings are determined by pure mathematical transparency.
          </p>
        </div>
      </div>

      {/* 2. Founder Profile Card (Outbid.lol Style) */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-lg space-y-6">
        {/* Founder Quote */}
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
          &ldquo;The board is still here. Same rules. Same idea. Rank is what you pay — nothing else.&rdquo;
        </p>

        {/* Profile Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-2">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-blue-500/30 p-0.5 shadow-md shrink-0 bg-slate-100 dark:bg-slate-800">
              <Image
                src="/founder.png"
                alt="Nafiz — Founder of RankUp"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            {/* Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Nafiz
                </h3>
                <span className="text-xs font-mono font-semibold text-blue-500">
                  @founder
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Founder &amp; Creator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Indie hacker, SaaS builder, and aspiring AI Engineer. Dedicated to engineering transparent, high-performance web products and autonomous AI systems.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <a
              href={FOUNDER_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-500 transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title="Connect on X"
            >
              <XIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Follow on X</span>
            </a>

            <a
              href={FOUNDER_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
              title="Connect on LinkedIn"
            >
              <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Live Financial & Platform Metrics Grid */}
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
              <span className="text-xs font-semibold text-slate-400">Total Volume</span>
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">
              100% Live
            </div>
            <div className="text-[11px] text-slate-400 font-medium">processed via Paddle</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-emerald-500">
              <span className="text-xs font-semibold text-slate-400">Audience Quality</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Founders &amp; Devs
            </div>
            <div className="text-[11px] text-slate-400 font-medium">high-intent tech visitors</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-purple-500">
              <span className="text-xs font-semibold text-slate-400">Active Slots</span>
              <Package className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
              7 Days
            </div>
            <div className="text-[11px] text-slate-400 font-medium">guaranteed live duration</div>
          </div>

          <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-semibold text-slate-400">Average CTR</span>
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400">
              4.8%
            </div>
            <div className="text-[11px] text-slate-400 font-medium">outbound clicks to sites</div>
          </div>
        </div>
      </div>

      {/* 4. Why RankUp Manifesto */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Why We Built RankUp
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
              RankUp strips away the illusion. We created a 100% transparent marketplace where visibility is purely mathematical: pay more, rank higher.
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

      {/* 5. CTA Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold">
            Ready to claim your spot?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            Place your product on RankUp starting at just $5 with instant activation.
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
