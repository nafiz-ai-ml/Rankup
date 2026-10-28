"use client";

import * as React from "react";
import { RankEvent } from "@/types/database";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, DollarSign } from "lucide-react";

interface RankHistoryChartProps {
  events: RankEvent[];
}

export function RankHistoryChart({ events }: RankHistoryChartProps) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 rounded-2xl glass-surface border border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No rank events recorded yet.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass-surface border border-slate-200/90 dark:border-white/10 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span>Rank & Placement Timeline</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {events.length} {events.length === 1 ? "Event" : "Events"} Logged
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
        {events.map((ev, index) => {
          const isUp = ev.previous_rank && ev.new_rank ? ev.new_rank < ev.previous_rank : true;

          return (
            <div key={ev.id || index} className="relative flex items-start justify-between gap-4 text-xs">
              {/* Dot on timeline */}
              <div
                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0B0F19] ${
                  ev.event_type === "created"
                    ? "bg-emerald-500"
                    : ev.event_type === "boosted"
                    ? "bg-blue-500"
                    : ev.event_type === "reclaimed"
                    ? "bg-amber-500"
                    : "bg-purple-500"
                }`}
              />

              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="capitalize">{ev.event_type}</span>
                  {ev.new_rank && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-black text-[11px]">
                      Rank #{ev.new_rank}
                    </span>
                  )}
                  {ev.previous_rank && ev.new_rank && (
                    <span className="flex items-center text-[10px] text-slate-400">
                      (from #{ev.previous_rank})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(ev.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {ev.amount_usd && (
                <div className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  <DollarSign className="w-3 h-3 text-emerald-500" />
                  <span>+{ev.amount_usd}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
