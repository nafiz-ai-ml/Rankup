"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { Listing } from "@/types/database";
import { BoardControls } from "@/components/leaderboard/BoardControls";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { SideWidgets } from "@/components/leaderboard/SideWidgets";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Trophy, Zap, Clock, Plus, Info, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = React.useState(1);

  // Live database state
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [allTimeTopListings, setAllTimeTopListings] = React.useState<Listing[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [todayLeaderSpend, setTodayLeaderSpend] = React.useState(0);
  const [allTimeLeaderSpend, setAllTimeLeaderSpend] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Sync with searchParams
  React.useEffect(() => {
    if (boardParam === "all-time" || boardParam === "today") {
      setActiveBoard(boardParam);
      setCurrentPage(1);
    }
  }, [boardParam]);

  const handleBoardChange = (board: "all-time" | "today") => {
    setActiveBoard(board);
    setCurrentPage(1);
  };

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategoryId(catId);
    setCurrentPage(1);
  };

  // Fetch live listings
  const fetchListings = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const categoryQuery = selectedCategoryId ? `&category=${selectedCategoryId}` : "";
      const res = await fetch(
        `/api/listings?board=${activeBoard}${categoryQuery}&page=${currentPage}&limit=20`,
        { cache: "no-store" }
      );
      const data = await res.json();

      if (data && Array.isArray(data.listings)) {
        setListings(data.listings);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setTodayLeaderSpend(data.todayLeaderSpend || 0);
        setAllTimeLeaderSpend(data.allTimeLeaderSpend || 0);
      }
    } catch (err) {
      console.error("Failed to fetch live listings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeBoard, selectedCategoryId, currentPage]);

  // Fetch side widget once
  React.useEffect(() => {
    async function fetchSideWidget() {
      try {
        const res = await fetch(`/api/listings?board=all-time&limit=10`, { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.listings)) {
          setAllTimeTopListings(data.listings);
        }
      } catch (err) {
        console.error("Failed to fetch side widget listings:", err);
      }
    }
    fetchSideWidget();
  }, []);

  React.useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const topLeaderSpend = activeBoard === "today" ? todayLeaderSpend : allTimeLeaderSpend;
  const nextTargetBid = topLeaderSpend > 0 ? topLeaderSpend + 2 : 5;

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
      bidAmount: nextTargetBid,
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
                ? "Bids placed today in UTC. The leader at midnight wins the daily archive badge."
                : "The highest funded products across the entire lifetime of RankUp. Every dollar spent ranks you permanently on this board."}
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
            onBoardChange={handleBoardChange}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {isLoading ? (
            <div className="p-12 text-center rounded-3xl glass-surface border border-slate-200 dark:border-white/10 space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Loading live leaderboard...
              </p>
            </div>
          ) : listings.length === 0 ? (
            activeBoard === "today" ? (
              /* Fresh Empty State for Today's Board */
              <div className="p-8 sm:p-12 text-center rounded-3xl glass-surface border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    The podium is wide open!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    No products have placed bids yet today. Claim the #1 spot on today&apos;s leaderboard for only $5!
                  </p>
                </div>
                <button
                  onClick={() => openClaimModal({ bidAmount: 5, categoryId: selectedCategoryId || undefined })}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Claim #1 Today</span>
                </button>
              </div>
            ) : (
              /* Empty State for All-Time Board */
              <div className="p-8 sm:p-12 text-center rounded-3xl glass-surface border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto shadow-inner">
                  <Info className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    Be the first to claim a spot on the leaderboard!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Every bid guarantees 7 full days of verified placement and high-intent founder traffic.
                  </p>
                </div>
                <button
                  onClick={() => openClaimModal({ bidAmount: 5, categoryId: selectedCategoryId || undefined })}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>Claim a Rank for $5</span>
                </button>
              </div>
            )
          ) : viewMode === "cards" ? (
            <div className="space-y-3.5">
              {listings.map((item, index) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  rank={(currentPage - 1) * 20 + index + 1}
                  activeBoard={activeBoard}
                  onOutbidClick={handleOutbidClick}
                />
              ))}
            </div>
          ) : (
            <TableView
              listings={listings}
              activeBoard={activeBoard}
              onOutbidClick={handleOutbidClick}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-all inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="font-mono text-slate-500 dark:text-slate-400">
                Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of{" "}
                <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({totalCount} total)
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-all inline-flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Desktop Side-Rail Widgets */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <SideWidgets
            allTimeTopListings={allTimeTopListings}
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
