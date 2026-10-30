"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
  Clock,
  DollarSign,
  AlertTriangle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function RulesAndFaqPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      category: "Ranking Math",
      q: "How does the ranking system work?",
      a: "Rankup ranks products strictly by the cumulative dollar amount paid through our verified Paddle payment gateway. Unlike Product Hunt or Reddit, there are no upvote bots, algorithmic curation, or editorial bias. More spend = higher rank.",
    },
    {
      category: "Bidding",
      q: "What is the minimum bid to claim a rank?",
      a: "The minimum entry bid is $5. This gets your product listed on both the All-Time and Today's leaderboard for 7 full days with instant public placement.",
    },
    {
      category: "Takeover Formula",
      q: "How do I take over the #1 spot?",
      a: "To claim #1 today, your bid must be at least Current Leader's Spend + $2. For example, if #1 has paid $100 today, bidding $102 immediately places you at #1 with the gold crown badge and front-page spotlight.",
    },
    {
      category: "Boost Window",
      q: "What is the 15-Minute Boost Window?",
      a: "When you claim a rank or boost, you receive a 15-minute protection window. If someone outbids you during those 15 minutes, you can instantly reclaim your position by paying only the difference + $2.",
    },
    {
      category: "Placement",
      q: "How long does my product stay on the leaderboard?",
      a: "Every payment guarantees 7 full days (168 hours) of active visibility. After 7 days, your listing expires from the active boards, but your cumulative spend remains recorded permanently in the historical archives.",
    },
    {
      category: "Reset Schedule",
      q: "When does the Today's board reset?",
      a: "The Today's board resets every single night at 00:00 UTC (Universal Coordinated Time). Daily totals reset to $0, and a permanent archive snapshot is created. The All-Time board never resets.",
    },
    {
      category: "Billing",
      q: "Can I get a refund if I am outbid?",
      a: "No. Rankup operates under a strict, non-negotiable no-refund policy. When you bid, you are paying for real-time live exposure, direct clicks, and backlink presence.",
    },
    {
      category: "Security",
      q: "What types of websites or handles are prohibited?",
      a: "We strictly prohibit adult content, illegal gambling, hate speech, malicious malware, deceptive phishing, and scam schemes. Violating listings are instantly blacklisted without refund.",
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>TRANSPARENT PLATFORM MANUAL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rules, Ranking Math & FAQ
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about the Rankup mathematical ordering, 15-minute boost window, daily resets, and legal policies.
          </p>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            $5 Minimum Entry
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No subscription, no account required. Enter with $5 for 7 full days of live public placement.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Leader + $2 Formula
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Taking #1 requires just $2 more than the active leader. Instant takeover with zero waiting.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            15-Min Boost Window
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Get outbid in 15 minutes? Reclaim immediately for the exact difference plus $2.
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            00:00 UTC Daily Reset
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Today&apos;s board resets every night at midnight UTC. Daily winner is archived forever.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions with Silk-Smooth Animated Accordion */}
      <div id="faq" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-slate-500">
              Answers to the most common questions asked by founders and advertisers.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const padNum = (idx + 1).toString().padStart(2, "0");

            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? "glass-surface border-blue-500/40 shadow-md shadow-blue-500/5 bg-gradient-to-r from-blue-500/[0.03] to-transparent"
                    : "glass-surface border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-1 rounded-lg transition-colors shrink-0 ${
                        isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                      }`}
                    >
                      {padNum}
                    </span>

                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">
                        {faq.category}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors block">
                        {faq.q}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 rotate-180"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth Animated Height & Opacity Transition */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5">
                      <p className="pl-9">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Policy Anchor Sections */}
      <div className="space-y-8 pt-8 border-t border-slate-200/80 dark:border-white/10">
        {/* Terms of Service */}
        <section id="terms" className="p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Terms of Service
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            By submitting a URL or X handle and completing payment via Paddle, you certify that you own or are an authorized representative of the submitted product. Rankup reserves the right to modify listing text for formatting or clarity and remove any listing violating our content policies.
          </p>
        </section>

        {/* Privacy Policy */}
        <section id="privacy" className="p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Privacy Policy
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Rankup collects zero passwords or authentication credentials. We record the public destination URL, title, favicon, and email address provided during Paddle checkout for transaction receipt purposes. We never sell, share, or monetize your contact information.
          </p>
        </section>

        {/* Refund Policy */}
        <section id="refund-policy" className="p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Strict No-Refund Policy</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All payments made on Rankup are final and non-refundable. Since visibility and ranking positioning occur immediately upon webhook confirmation, services are deemed fully rendered at the moment of payment. Chargebacks or disputes will result in permanent domain blacklisting across the platform.
          </p>
        </section>

        {/* Sponsored Placement Disclosure */}
        <section id="sponsored-disclosure" className="p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Sponsored Placement Disclosure</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            In compliance with FTC guidelines, all listings on Rankup are paid advertisements. Rank position is determined solely by mathematical ordering of cumulative payments and does not constitute an endorsement, editorial review, or organic merit ranking by Rankup.
          </p>
        </section>
      </div>
    </div>
  );
}
