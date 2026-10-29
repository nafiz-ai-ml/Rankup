"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES, MOCK_LISTINGS } from "@/lib/mockData";
import { Listing } from "@/types/database";
import { HeroStepper } from "@/components/leaderboard/HeroStepper";
import { HeroClaimBar } from "@/components/claim/HeroClaimBar";
import { BoardControls } from "@/components/leaderboard/BoardControls";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { SideWidgets } from "@/components/leaderboard/SideWidgets";
import { ProofStrip } from "@/components/leaderboard/ProofStrip";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Trophy, Shield, Zap, Info } from "lucide-react";

function HomePageContent() {
  const searchParams = useSearchParams();
  const boardParam = searchParams.get("board");
  const { openClaimModal } = useClaimModal();

  const [activeBoard, setActiveBoard] = React.useState<"all-time" | "today">(
    boardParam === "all-time" ? "all-time" : "today"
  );
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");
  const [prefilledUrl, setPrefilledUrl] = React.useState("");

  // Sync board with query param if present
  React.useEffect(() => {
    if (boardParam === "all-time" || boardParam === "today") {
      setActiveBoard(boardParam);
    }
  }, [boardParam]);

  // Filter & Sort Listings according to ranking rules
  const sortedListings = React.useMemo(() => {
    let list = [...MOCK_LISTINGS];

    // 1. Filter by category if selected
    if (selectedCategoryId) {
      list = list.filter((item) => item.category_id === selectedCategoryId);
    }

    // 2. Sort by active board
    if (activeBoard === "today") {
      list.sort((a, b) => (b.spend?.today_total ?? 0) - (a.spend?.today_total ?? 0));
    } else {
      list.sort((a, b) => (b.spend?.all_time_total ?? 0) - (a.spend?.all_time_total ?? 0));
    }

    return list;
  }, [activeBoard, selectedCategoryId]);

  // Current #1 leader spend for stepper calculation
  const currentLeaderSpend = React.useMemo(() => {
    if (sortedListings.length === 0) return 0;
    const topItem = sortedListings[0];
    return activeBoard === "today"
      ? topItem.spend?.today_total ?? 0
      : topItem.spend?.all_time_total ?? 0;
  }, [sortedListings, activeBoard]);

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
            <strong>17 founders online</strong> • 1,240 visitors today
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
        initialValue={prefilledUrl}
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
            onBoardChange={setActiveBoard}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Leaderboard View: Cards or Table */}
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
