"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/database";
import {
  ExternalLink,
  MousePointerClick,
  Clock,
  Crown,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  rank: number;
  activeBoard: "all-time" | "today";
  onOutbidClick: (listing: Listing) => void;
}

export function ListingCard({
  listing,
  rank,
  activeBoard,
  onOutbidClick,
}: ListingCardProps) {
  const [imageError, setImageError] = React.useState(false);

  const displayAmount =
    activeBoard === "today"
      ? listing.spend?.today_total ?? 0
      : listing.spend?.all_time_total ?? 0;

  // Clean domain name for display
  const displayDomain = React.useMemo(() => {
    if (listing.destination_url) {
      try {
        return new URL(listing.destination_url).hostname.replace(/^www\./, "");
      } catch {
        return listing.destination_url;
      }
    }
    return listing.x_handle ? `@${listing.x_handle}` : "";
  }, [listing.destination_url, listing.x_handle]);

  // Rank Badge Styles
  const isRank1 = rank === 1;
  const isRank2 = rank === 2;
  const isRank3 = rank === 3;

  return (
    <div
      className={`group relative p-3.5 sm:p-5 rounded-2xl transition-all duration-300 border w-full max-w-full overflow-hidden ${
        isRank1
          ? "glass-surface border-amber-500/40 dark:border-amber-500/30 glow-gold bg-gradient-to-r from-amber-500/[0.04] via-transparent to-transparent"
          : isRank2
          ? "glass-surface border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500"
          : isRank3
          ? "glass-surface border-amber-800/30 dark:border-amber-700/30 hover:border-amber-600/40"
          : "glass-surface border-slate-200/80 dark:border-white/10 hover:border-blue-500/30 hover:-translate-y-0.5 shadow-sm"
      }`}
    >
      {/* Rank #1 Crown Badge Header (Inside card to avoid overflow clipping) */}
      {isRank1 && (
        <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-amber-500/20 w-full">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-extrabold shadow-sm tracking-wider uppercase">
            <Crown className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>Current #1 Leader</span>
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            Gold Podium Champion
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
        {/* Left Section: Rank Badge + Favicon + Content */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full">
          {/* Rank Badge */}
          <div
            className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center font-mono font-black text-xs sm:text-base shadow-sm ${
              isRank1
                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30"
                : isRank2
                ? "bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800 text-slate-800 dark:text-slate-200"
                : isRank3
                ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-amber-900/20"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
            }`}
          >
            #{rank}
          </div>

          {/* Favicon / Avatar */}
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shadow-sm">
            {listing.favicon_url && !imageError ? (
              <Image
                src={listing.favicon_url}
                alt={listing.title}
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-lg"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <span className="font-bold text-sm sm:text-base text-blue-500">
                {listing.title.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Content Details */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Link
                href={`/r/${listing.slug}`}
                className="font-bold text-xs sm:text-base text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors truncate max-w-full"
              >
                {listing.title}
              </Link>

              {listing.category && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  {listing.category.name}
                </span>
              )}
            </div>

            {listing.short_description && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {listing.short_description}
              </p>
            )}

            {/* Micro Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-1 sm:mt-1.5 font-medium">
              {displayDomain && (
                <a
                  href={listing.destination_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-500 transition-colors max-w-[120px] sm:max-w-none truncate"
                >
                  <span className="truncate">{displayDomain}</span>
                  <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                </a>
              )}

              <span>•</span>

              <span className="flex items-center gap-1 shrink-0">
                <MousePointerClick className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {listing.click_count || 0} clicks
              </span>

              <span>•</span>

              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                7 days active
              </span>

              <Link
                href={`/r/${listing.slug}`}
                className="text-blue-500 hover:underline flex items-center gap-0.5 ml-1 shrink-0"
              >
                <span>details</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Spend Badge & Outbid CTA */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
          {/* Paid Amount Pill */}
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-400">Paid:</span>
            <span
              className={`font-mono font-extrabold text-sm sm:text-lg ${
                isRank1
                  ? "text-amber-500"
                  : isRank2
                  ? "text-slate-700 dark:text-slate-200"
                  : isRank3
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              ${displayAmount}
            </span>
          </div>

          {/* Outbid / Boost Button */}
          <button
            onClick={() => onOutbidClick(listing)}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Outbid</span>
          </button>
        </div>
      </div>
    </div>
  );
}
