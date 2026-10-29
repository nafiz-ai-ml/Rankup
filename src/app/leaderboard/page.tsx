"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES, MOCK_LISTINGS } from "@/lib/mockData";
import { Listing } from "@/types/database";
import { BoardControls } from "@/components/leaderboard/BoardControls";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { SideWidgets } from "@/components/leaderboard/SideWidgets";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Trophy, Zap, Clock, Plus, Info, Sparkles } from "lucide-react";
import { UtcCountdown } from "@/components/layout/UtcCountdown";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const boardParam = searchParams.get("board");
  const { openClaimModal } = useClaimModal();

  const [activeBoard, setActiveBoard] = React.useState<"all-time" | "today">(
    boardParam === "today" ? "today" : "all-time"
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  // Sync with searchParams
  React.useEffect(() => {
    if (boardParam === "all-time" || boardParam === "today") {
      setActiveBoard(boardParam);
    }
  }, [boardParam]);

  // Sort & filter
  const sortedListings = React.useMemo(() => {
    let list = [...MOCK_LISTINGS];

    if (selectedCategoryId) {
      list = list.filter((item) => item.category_id === selectedCategoryId);
    }

    if (activeBoard === "today") {
      list.sort((a, b) => (b.spend?.today_total ?? 0) - (a.spend?.today_total ?? 0));
    } else {
      list.sort((a, b) => (b.spend?.all_time_total ?? 0) - (a.spend?.all_time_total ?? 0));
    }

    return list;
  }, [activeBoard, selectedCategoryId]);

  const topListing = sortedListings[0];
  const topBid = topListing
    ? activeBoard === "today"
      ? topListing.spend?.today_total ?? 0
      : topListing.spend?.all_time_total ?? 0
    : 0;
  const nextTargetBid = Math.max(5, topBid + 2);

  const handleOutbidClick = (listing: Listing) => {
    const destination = listing.destination_url || (listing.x_handle ? `@${listing.x_handle}` : "");
    openClaimModal({
      destination,
      categoryId: listing.category_id,
    });
  };

  const handleClaimTop = () => {
    openClaimModal({
      categoryId: selectedCategoryId || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              {activeBoard === "today" ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>TODAY&apos;S LIVE BOARD • RESETS AT 00:00 UTC</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>ALL-TIME CUMULATIVE HALL OF FAME</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {activeBoard === "today" ? "Today's Public Leaderboard" : "All-Time Top Ranked Products"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeBoard === "today"
                ? "Bids placed today between 00:00 and 23:59 UTC. The leader at midnight wins the daily archive badge."
                : "The highest funded products across the entire lifetime of Rankup. Every dollar spent ranks you permanently on this board."}
            </p>
          </div>

          {/* Quick Action & Countdown Box */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 w-full md:w-auto shrink-0">
            {activeBoard === "today" && (
              <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Reset in:
                </span>
                <UtcCountdown />
              </div>
            )}

            <button
              onClick={handleClaimTop}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Claim #1 Spot for ${nextTargetBid}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Leaderboard + Sidebar Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8 pt-2">
        {/* Left Column: Board Controls & Listing Cards */}
        <div className="flex-1 w-full space-y-5">
          <BoardControls
            categories={MOCK_CATEGORIES}
            activeBoard={activeBoard}
            onBoardChange={setActiveBoard}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {sortedListings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-surface border border-slate-200 dark:border-white/10 space-y-2">
              <Info className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No active listings found in this category yet.
              </p>
              <p className="text-xs text-slate-400">
                Be the first to claim #1 for only $5!
              </p>
            </div>
          ) : viewMode === "cards" ? (
            <div className="space-y-3.5">
              {sortedListings.map((item, index) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  rank={index + 1}
                  activeBoard={activeBoard}
                  onOutbidClick={handleOutbidClick}
                />
              ))}
            </div>
          ) : (
            <TableView
              listings={sortedListings}
              activeBoard={activeBoard}
              onOutbidClick={handleOutbidClick}
            />
          )}
        </div>

        {/* Right Column: Desktop Side-Rail Widgets */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <SideWidgets
            allTimeTopListings={MOCK_LISTINGS}
            onListingClick={handleOutbidClick}
          />
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <React.Suspense
      fallback={<div className="p-8 text-center text-xs text-slate-400">Loading leaderboard...</div>}
    >
      <LeaderboardContent />
    </React.Suspense>
  );
}

