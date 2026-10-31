"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Listing } from "@/types/database";
import {
  ChevronLeft,
  Trophy,
  Zap,
  Plus,
  LayoutGrid,
  LayoutList,
  Clock,
  Loader2,
} from "lucide-react";
import { UtcCountdown } from "@/components/layout/UtcCountdown";

function CategoryDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || "developer-tools";
  const boardParam = searchParams.get("board");
  const { openClaimModal } = useClaimModal();

  const [activeBoard, setActiveBoard] = React.useState<"all-time" | "today">(
    boardParam === "today" ? "today" : "all-time"
  );
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  // Find category definition
  const category = React.useMemo(() => {
    return (
      MOCK_CATEGORIES.find((c) => c.slug === slug || c.id === slug) ||
      MOCK_CATEGORIES[0]
    );
  }, [slug]);

  // Live category listings state
  const [categoryListings, setCategoryListings] = React.useState<Listing[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadCategoryListings() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/listings?board=${activeBoard}&category=${category.id}&limit=50`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (data && Array.isArray(data.listings)) {
          setCategoryListings(data.listings);
        }
      } catch (err) {
        console.error("Failed to load category listings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategoryListings();
  }, [category.id, activeBoard]);

  const topListing = categoryListings[0];
  const topBid = topListing
    ? activeBoard === "today"
      ? topListing.spend?.today_total ?? 0
      : topListing.spend?.all_time_total ?? 0
    : 0;
  const nextTargetBid = topBid > 0 ? topBid + 2 : 5;

  const handleOutbidClick = (listing: Listing) => {
    const destination = listing.destination_url || (listing.x_handle ? `@${listing.x_handle}` : "");
    openClaimModal({
      destination,
      categoryId: category.id,
    });
  };

  const handleClaimCategoryRank = () => {
    openClaimModal({
      categoryId: category.id,
      bidAmount: nextTargetBid,
    });
  };

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Back button */}
      <div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>
      </div>

      {/* Category Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-md">
              <CategoryIcon name={category.icon_name} slug={category.slug} className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <span>Category Leaderboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                {category.description}
              </p>
            </div>
          </div>

          {/* Quick Claim Button & Countdown */}
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
              onClick={handleClaimCategoryRank}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Claim #1 in {category.name.split(" ")[0]} for ${nextTargetBid}</span>
            </button>
            <div className="text-[11px] text-slate-400 text-center md:text-right">
              {categoryListings.length} active {categoryListings.length === 1 ? "product" : "products"} competing
            </div>
          </div>
        </div>
      </div>

      {/* Board Controls: All-time vs Today + View switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center p-1 rounded-2xl glass-surface border border-slate-200 dark:border-white/10 shadow-sm">
          <button
            onClick={() => setActiveBoard("all-time")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeBoard === "all-time"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>All-time</span>
          </button>

          <button
            onClick={() => setActiveBoard("today")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeBoard === "today"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Today</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
          </button>
        </div>

        <div className="inline-flex items-center p-1 rounded-xl glass-surface border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
            title="Table View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Listings */}
      {isLoading ? (
        <div className="p-12 text-center rounded-3xl glass-surface border border-slate-200 dark:border-white/10 space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading {category.name} listings...
          </p>
        </div>
      ) : categoryListings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-surface border border-slate-200 dark:border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
            <CategoryIcon name={category.icon_name} slug={category.slug} className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No products currently ranked in {category.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Be the very first founder to rank in this category! Take #1 guaranteed for only $5.
          </p>
          <button
            onClick={handleClaimCategoryRank}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Claim #1 Spot for $5
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="space-y-3.5">
          {categoryListings.map((item, index) => (
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
          listings={categoryListings}
          activeBoard={activeBoard}
          onOutbidClick={handleOutbidClick}
        />
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <React.Suspense
      fallback={<div className="p-8 text-center text-xs text-slate-400">Loading category...</div>}
    >
      <CategoryDetailContent />
    </React.Suspense>
  );
}
