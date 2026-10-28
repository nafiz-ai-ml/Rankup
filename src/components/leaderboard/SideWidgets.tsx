"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/database";
import { Trophy, Activity, ChevronRight, TrendingUp } from "lucide-react";

interface SideWidgetsProps {
  allTimeTopListings: Listing[];
  onListingClick?: (listing: Listing) => void;
}

export function SideWidgets({ allTimeTopListings, onListingClick }: SideWidgetsProps) {
  // Mock recent activity stream
  const activities = [
    {
      id: "a1",
      title: "Supastarter",
      rank: 1,
      amount: 102,
      time: "2 hours ago",
      icon: "https://www.google.com/s2/favicons?domain=supastarter.dev&sz=64",
    },
    {
      id: "a2",
      title: "PostHog",
      rank: 4,
      amount: 62,
      time: "1 hour ago",
      icon: "https://www.google.com/s2/favicons?domain=posthog.com&sz=64",
    },
    {
      id: "a3",
      title: "Cursor",
      rank: 7,
      amount: 35,
      time: "3 hours ago",
      icon: "https://www.google.com/s2/favicons?domain=cursor.com&sz=64",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. All-time Ranking Mini-Board Widget */}
      <div className="p-5 rounded-2xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>All-time ranking</span>
          </div>
          <Link
            href="/leaderboard?board=all-time"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center gap-0.5"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {allTimeTopListings.slice(0, 10).map((item, index) => {
            const rank = index + 1;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-xs py-1 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold text-slate-400 w-5 shrink-0 text-center">
                    #{rank}
                  </span>
                  <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-0.5">
                    {item.favicon_url ? (
                      <Image
                        src={item.favicon_url}
                        alt={item.title}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain rounded"
                        unoptimized
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-blue-500 flex items-center justify-center">
                        {item.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/r/${item.slug}`}
                    className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-500 truncate"
                  >
                    {item.title.split("—")[0].trim()}
                  </Link>
                </div>

                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                  ${item.spend?.all_time_total || 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Latest Activity Ticker Widget */}
      <div className="p-5 rounded-2xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/10">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Latest activity</span>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Image
                  src={act.icon}
                  alt={act.title}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-md object-contain"
                  unoptimized
                />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {act.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    claimed #{act.rank} • {act.time}
                  </div>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +${act.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
