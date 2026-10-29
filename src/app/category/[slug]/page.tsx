"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { MOCK_CATEGORIES, MOCK_LISTINGS } from "@/lib/mockData";
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
  Info,
  Clock,
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

  // Find category by slug
  const category = React.useMemo(() => {
    return (
      MOCK_CATEGORIES.find((c) => c.slug === slug || c.id === slug) ||
      MOCK_CATEGORIES[0]
    );
  }, [slug]);

  // Find listings in this category
  const categoryListings = React.useMemo(() => {
    const list = MOCK_LISTINGS.filter((item) => item.category_id === category.id);
    if (activeBoard === "today") {
      list.sort((a, b) => (b.spend?.today_total ?? 0) - (a.spend?.today_total ?? 0));
    } else {
      list.sort((a, b) => (b.spend?.all_time_total ?? 0) - (a.spend?.all_time_total ?? 0));
    }
    return list;
  }, [category.id, activeBoard]);

  const topListing = categoryListings[0];
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
      categoryId: category.id,
    });
  };

  const handleClaimCategoryRank = () => {
    openClaimModal({
      categoryId: category.id,
    });
  };

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-blue-500 transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          {category.name}
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-inner">
              <CategoryIcon
                name={category.icon_name}
                slug={category.slug}
                className="w-7 h-7"
              />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                <span>CATEGORY LEADERBOARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {category.description}
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleClaimCategoryRank}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Claim #1 in this Category for ${nextTargetBid}</span>
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
      {categoryListings.length === 0 ? (
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

