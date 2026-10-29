"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Trophy, Calendar, ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
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
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
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
      <div className="space-y-4">
        {archiveDays.map((day) => (
          <div
            key={day.date}
            className="p-5 sm:p-6 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Left: Date & Winning product */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>{day.displayDate}</span>
              </div>

              <div className="flex items-center gap-3.5 min-w-0">
                {/* Gold Crown Trophy for #1 winner */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>

                <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-slate-800">
                  {day.winner.favicon_url && (
                    <Image
                      src={day.winner.favicon_url}
                      alt={day.winner.title}
                      width={36}
                      height={36}
                      className="w-full h-full object-contain rounded-lg"
                      unoptimized
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {day.winner.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      #1 Winner
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-md">
                    {day.winner.short_description}
                  </p>
                </div>
              </div>

              {/* Runners up */}
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span>#2: <strong className="text-slate-700 dark:text-slate-300">{day.secondPlace?.title.split("—")[0].trim()}</strong></span>
                <span>•</span>
                <span>#3: <strong className="text-slate-700 dark:text-slate-300">{day.thirdPlace?.title.split("—")[0].trim()}</strong></span>
              </div>
            </div>

            {/* Right: Winning Bid & Day Stats */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Winning Bid:</span>
                <span className="font-mono font-black text-xl text-amber-500">
                  ${day.winningBid}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">
                {day.totalBids} bids placed • ${day.totalDailyVolume} volume
              </div>

              <Link
                href={`/archive/${day.date}`}
                className="mt-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white transition-all flex items-center gap-1"
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

