"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { Listing } from "@/types/database";
import { HeroStepper } from "@/components/leaderboard/HeroStepper";
import { HeroClaimBar } from "@/components/claim/HeroClaimBar";
import { BoardControls } from "@/components/leaderboard/BoardControls";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { SideWidgets } from "@/components/leaderboard/SideWidgets";
import { ProofStrip } from "@/components/leaderboard/ProofStrip";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Trophy, Shield, Zap, Info, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

function HomePageContent() {
  const searchParams = useSearchParams();
  const boardParam = searchParams.get("board");
  const { openClaimModal } = useClaimModal();

  const [activeBoard, setActiveBoard] = React.useState<"all-time" | "today">(
    boardParam === "all-time" ? "all-time" : "today"
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Live database listings state
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [allTimeTopListings, setAllTimeTopListings] = React.useState<Listing[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [todayLeaderSpend, setTodayLeaderSpend] = React.useState(0);
  const [allTimeLeaderSpend, setAllTimeLeaderSpend] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  // Sync board with query param if present
  React.useEffect(() => {
    if (boardParam === "all-time" || boardParam === "today") {
      setActiveBoard(boardParam);
      setCurrentPage(1);
    }
  }, [boardParam]);

  // Reset page when category or board changes
  const handleBoardChange = (board: "all-time" | "today") => {
    setActiveBoard(board);
    setCurrentPage(1);
  };

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategoryId(catId);
    setCurrentPage(1);
  };

  // Fetch live listings from /api/listings
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

  // Fetch all-time top listings once for side widget
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

  // Current #1 leader spend for stepper calculation
  const currentLeaderSpend = activeBoard === "today" ? todayLeaderSpend : allTimeLeaderSpend;

  // Handle Outbid click on any card -> Opens ClaimModal directly pre-filled
  const handleOutbidClick = (listing: Listing) => {
    const destination = listing.destination_url || (listing.x_handle ? `@${listing.x_handle}` : "");
    openClaimModal({
      destination,
      categoryId: listing.category_id,
    });
  };

  // Handle Hero Claim Bar Submit -> Opens ClaimModal with entered destination & category
  const handleClaimSubmit = (destination: string, categoryId: string) => {
    openClaimModal({
      destination,
      categoryId,
    });
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-10 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* 1. Live Social Proof Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-indicator shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200">
            <strong>100% Live Leaderboard</strong> • Real-time Paddle Ledger
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          <span>7-Day Active</span>
          <span>•</span>
          <span className="text-blue-500 font-semibold">15-min Boost Window</span>
        </div>
      </div>

      {/* 2. Hero Headline with Dynamic Stepper */}
      <HeroStepper
        currentLeaderSpend={currentLeaderSpend}
        onPriceChange={(price) => {
          console.log("Selected target bid:", price);
        }}
      />

      {/* 3. Hero Claim Bar */}
      <HeroClaimBar
        categories={MOCK_CATEGORIES}
        initialValue=""
        onSubmit={handleClaimSubmit}
      />

      {/* 4. Feature Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Pay to Rank Up</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            The more you pay, the higher you rank. Real-time mathematical ordering with zero organic bias.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>15-Minute Boost Window</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Get outbid in your first 15 minutes? Reclaim your spot for only the difference plus $2.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>7 Days Guaranteed</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Every payment guarantees 7 full days of active leaderboard visibility before archival.
          </p>
        </div>
      </div>

      {/* 5. Main Content Area: Leaderboard + Side-Rail Widgets */}
      <div className="flex flex-col lg:flex-row items-start gap-8 pt-4">
        {/* Left Column: Board Controls & Listing Cards (Main Content) */}
        <div className="flex-1 w-full space-y-5">
          {/* Board Controls (All-Time / Today + Categories + Cards/Table toggle) */}
          <BoardControls
            categories={MOCK_CATEGORIES}
            activeBoard={activeBoard}
            onBoardChange={handleBoardChange}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Leaderboard View: Loading / Empty / Cards / Table */}
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

          {/* Pagination Controls (For 20+ listings) */}
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

      {/* 6. Milestone Proof & Transparency Strip */}
      <ProofStrip />
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading leaderboard...</div>}>
      <HomePageContent />
    </React.Suspense>
  );
}
