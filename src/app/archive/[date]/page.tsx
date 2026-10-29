"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_LISTINGS } from "@/lib/mockData";
import { ListingCard } from "@/components/leaderboard/ListingCard";
import { TableView } from "@/components/leaderboard/TableView";
import { Calendar, ChevronLeft, Trophy, LayoutGrid, LayoutList } from "lucide-react";

function ArchiveDateContent() {
  const params = useParams();
  const dateStr = (params?.date as string) || "2026-10-27";
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/archive" className="hover:text-blue-500 transition-colors">
          Daily Archive
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">
          {dateStr}
        </span>
      </div>

      {/* Snapshot Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>PERMANENT HISTORICAL ARCHIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Daily Leaderboard: {dateStr}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              This snapshot reflects the finalized leaderboard order at 23:59:59 UTC on {dateStr}. The records are cryptographically timestamped and immutable.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center shrink-0">
            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Winner of the Day
            </div>
            <div className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
              {MOCK_LISTINGS[0].title.split("—")[0].trim()}
            </div>
            <div className="font-mono font-bold text-amber-500 text-sm">
              Winning Bid: $102
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Showing 10 archived rankings for this date
        </span>

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

      {/* Listings */}
      {viewMode === "cards" ? (
        <div className="space-y-3.5">
          {MOCK_LISTINGS.map((item, index) => (
            <ListingCard
              key={item.id}
              listing={item}
              rank={index + 1}
              activeBoard="all-time"
              onOutbidClick={() => {}}
            />
          ))}
        </div>
      ) : (
        <TableView
          listings={MOCK_LISTINGS}
          activeBoard="all-time"
          onOutbidClick={() => {}}
        />
      )}
    </div>
  );
}

export default function ArchiveDatePage() {
  return (
    <React.Suspense
      fallback={<div className="p-8 text-center text-xs text-slate-400">Loading daily archive...</div>}
    >
      <ArchiveDateContent />
    </React.Suspense>
  );
}
