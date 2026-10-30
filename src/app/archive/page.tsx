"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Trophy, Calendar, ArrowRight } from "lucide-react";
import { MOCK_LISTINGS } from "@/lib/mockData";

export default function DailyArchivePage() {
  // Generate realistic past archive snapshots
  const archiveDays = [
    {
      date: "2026-10-27",
      displayDate: "Yesterday — October 27, 2026",
      winner: MOCK_LISTINGS[0], // Supastarter
      winningBid: 102,
      totalBids: 24,
      totalDailyVolume: 640,
      secondPlace: MOCK_LISTINGS[1],
      thirdPlace: MOCK_LISTINGS[2],
    },
    {
      date: "2026-10-26",
      displayDate: "October 26, 2026",
      winner: MOCK_LISTINGS[1], // v0.dev
      winningBid: 98,
      totalBids: 19,
      totalDailyVolume: 512,
      secondPlace: MOCK_LISTINGS[0],
      thirdPlace: MOCK_LISTINGS[3],
    },
    {
      date: "2026-10-25",
      displayDate: "October 25, 2026",
      winner: MOCK_LISTINGS[2], // Raycast
      winningBid: 85,
      totalBids: 15,
      totalDailyVolume: 420,
      secondPlace: MOCK_LISTINGS[4],
      thirdPlace: MOCK_LISTINGS[0],
    },
    {
      date: "2026-10-24",
      displayDate: "October 24, 2026",
      winner: MOCK_LISTINGS[3], // PostHog
      winningBid: 74,
      totalBids: 12,
      totalDailyVolume: 360,
      secondPlace: MOCK_LISTINGS[2],
      thirdPlace: MOCK_LISTINGS[5],
    },
    {
      date: "2026-10-23",
      displayDate: "October 23, 2026",
      winner: MOCK_LISTINGS[5], // Linear
      winningBid: 68,
      totalBids: 11,
      totalDailyVolume: 295,
      secondPlace: MOCK_LISTINGS[1],
      thirdPlace: MOCK_LISTINGS[6],
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className="p-5 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <History className="w-3.5 h-3.5" />
            <span>DAILY MIDNIGHT ARCHIVES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Daily Leaderboard Archive
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every day at 00:00 UTC, the daily leaderboard freezes permanently. Explore past daily winners, winning takeover bids, and platform competition history.
          </p>
        </div>
      </div>

      {/* Archive Timeline Cards */}
      <div className="space-y-4 w-full max-w-full">
        {archiveDays.map((day) => (
          <div
            key={day.date}
            className="p-4 sm:p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/30 transition-all flex flex-col justify-between gap-4 sm:gap-5 w-full max-w-full overflow-hidden"
          >
            {/* 1. Date Header & #1 Winner Badge Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-100 dark:border-white/5 w-full">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{day.displayDate}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shrink-0 flex items-center gap-1 uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>#1 Daily Winner</span>
              </span>
            </div>

            {/* 2. Winning Product Details Row */}
            <div className="flex items-center gap-3 w-full min-w-0">
              {/* Product Favicon with Gold Ring */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border-2 border-amber-500/40 p-1 bg-white dark:bg-slate-800 shadow-sm">
                {day.winner.favicon_url ? (
                  <Image
                    src={day.winner.favicon_url}
                    alt={day.winner.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain rounded-lg"
                    unoptimized
                  />
                ) : (
                  <span className="font-bold text-sm text-blue-500 flex items-center justify-center w-full h-full">
                    {day.winner.title.charAt(0)}
                  </span>
                )}
              </div>

              {/* Product Title & Description (fully truncated and fluid) */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate w-full">
                  {day.winner.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate w-full mt-0.5">
                  {day.winner.short_description}
                </p>
              </div>
            </div>

            {/* 3. Runners Up Pills Row */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
              <span className="font-medium text-slate-500">Runners up:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[140px] sm:max-w-none">
                #2 {day.secondPlace?.title.split("—")[0].trim()}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[140px] sm:max-w-none">
                #3 {day.thirdPlace?.title.split("—")[0].trim()}
              </span>
            </div>

            {/* 4. Bottom Metric Row & Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5 w-full">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Winning Bid:</span>
                  <span className="font-mono font-black text-lg sm:text-xl text-amber-500">
                    ${day.winningBid}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {day.totalBids} bids • ${day.totalDailyVolume} volume
                </div>
              </div>

              <Link
                href={`/archive/${day.date}`}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <span>View Full Day Snapshot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
