"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_LISTINGS, MOCK_CATEGORIES } from "@/lib/mockData";
import { RankHistoryChart } from "@/components/leaderboard/RankHistoryChart";
import { useClaimModal } from "@/context/ClaimModalContext";
import {
  ExternalLink,
  MousePointerClick,
  Clock,
  Trophy,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { RankEvent } from "@/types/database";

function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || "supastarter";
  const { openClaimModal } = useClaimModal();

  // Find listing from mockData or fallback
  const listing = React.useMemo(() => {
    return (
      MOCK_LISTINGS.find((item) => item.slug === slug || item.id === slug) ||
      MOCK_LISTINGS[0]
    );
  }, [slug]);

  const currentRank = listing.rank || 1;
  const spendTotal = listing.spend?.all_time_total || 102;
  const category = MOCK_CATEGORIES.find((c) => c.id === listing.category_id) || MOCK_CATEGORIES[0];

  // Competitors in same category
  const competitors = React.useMemo(() => {
    return MOCK_LISTINGS.filter(
      (item) => item.category_id === listing.category_id && item.id !== listing.id
    ).slice(0, 3);
  }, [listing]);

  // Mock rank events timeline
  const rankEvents: RankEvent[] = [
    {
      id: "ev1",
      listing_id: listing.id,
      event_type: "created",
      previous_rank: null,
      new_rank: 5,
      amount_usd: 50,
      created_at: listing.first_paid_at || new Date().toISOString(),
    },
    {
      id: "ev2",
      listing_id: listing.id,
      event_type: "boosted",
      previous_rank: 5,
      new_rank: currentRank,
      amount_usd: spendTotal - 50,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ];

  const handleBoostClick = () => {
    openClaimModal({
      destination: listing.destination_url || (listing.x_handle ? `@${listing.x_handle}` : ""),
      categoryId: listing.category_id,
      bidAmount: currentRank === 1 ? 10 : 25,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </Link>
      </div>

      {/* 1. Main Product Header Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-1.5 shrink-0 shadow-md">
              <Image
                src={listing.favicon_url || "/brand/rankup-mark.svg"}
                alt={listing.title}
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-xl"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {listing.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {category.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                {listing.short_description}
              </p>
            </div>
          </div>

          {/* Outbound Link CTA */}
          <a
            href={`/api/clicks/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Current Rank
            </span>
            <div className="font-mono font-black text-2xl text-slate-900 dark:text-white">
              #{currentRank}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Cumulative Spend
            </span>
            <div className="font-mono font-black text-2xl text-blue-600 dark:text-blue-400">
              ${spendTotal}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              Active Visibility
            </span>
            <div className="font-mono font-black text-2xl text-emerald-600 dark:text-emerald-400">
              7 Days
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <MousePointerClick className="w-3.5 h-3.5 text-purple-500" />
              Tracked Clicks
            </span>
            <div className="font-mono font-black text-2xl text-slate-900 dark:text-white">
              {listing.click_count || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Boost Panel */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Climb The Leaderboard</span>
          </div>
          <h3 className="text-xl font-black">
            Boost {listing.title.split("—")[0].trim()} Now
          </h3>
          <p className="text-xs text-blue-100">
            Increase your cumulative spend to protect your placement or reclaim #1.
          </p>
        </div>

        <button
          onClick={handleBoostClick}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-extrabold text-sm shadow-lg shadow-black/10 flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Boost This Listing</span>
        </button>
      </div>

      {/* 3. Rank History Timeline */}
      <RankHistoryChart events={rankEvents} />

      {/* 4. Competitors in Same Category */}
      {competitors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Competing in {category.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {competitors.map((comp) => (
              <Link
                key={comp.id}
                href={`/r/${comp.slug}`}
                className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 transition-all space-y-2 block"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-slate-800">
                    <Image
                      src={comp.favicon_url || "/brand/rankup-mark.svg"}
                      alt={comp.title}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain rounded"
                      unoptimized
                    />
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-500">
                    #{comp.rank}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {comp.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  ${comp.spend?.all_time_total || 0} USD paid
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. Sponsored Placement Legal Disclaimer */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Sponsored Placement Disclosure</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          This product placement is active for 7 days based on cumulative spend through Paddle. Rank is determined mathematically by amount paid, not by editorial review.
        </p>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading product details...</div>}>
      <ProductDetailContent />
    </React.Suspense>
  );
}
