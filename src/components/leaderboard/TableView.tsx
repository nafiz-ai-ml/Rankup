"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/database";
import { TrendingUp } from "lucide-react";

interface TableViewProps {
  listings: Listing[];
  activeBoard: "all-time" | "today";
  onOutbidClick: (listing: Listing) => void;
}

export function TableView({
  listings,
  activeBoard,
  onOutbidClick,
}: TableViewProps) {
  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 w-14 text-center">Rank</th>
              <th className="py-3 px-3 sm:px-4">Product</th>
              <th className="py-3 px-3 sm:px-4 hidden md:table-cell">Category</th>
              <th className="py-3 px-3 sm:px-4 hidden sm:table-cell">Clicks</th>
              <th className="py-3 px-3 sm:px-4 text-right">Paid (USD)</th>
              <th className="py-3 px-3 sm:px-4 w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
            {listings.map((item, index) => {
              const rank = index + 1;
              const displayAmount =
                activeBoard === "today"
                  ? item.spend?.today_total ?? 0
                  : item.spend?.all_time_total ?? 0;

              let hostname = "";
              if (item.destination_url) {
                try {
                  hostname = new URL(item.destination_url).hostname.replace(/^www\./, "");
                } catch {
                  hostname = item.destination_url;
                }
              } else if (item.x_handle) {
                hostname = `@${item.x_handle}`;
              }

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Rank */}
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span
                      className={`inline-block font-mono font-bold px-2 py-0.5 rounded-md ${
                        rank === 1
                          ? "bg-amber-500 text-white"
                          : rank === 2
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                          : rank === 3
                          ? "bg-amber-700 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      #{rank}
                    </span>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-slate-800">
                        {item.favicon_url ? (
                          <Image
                            src={item.favicon_url}
                            alt={item.title}
                            width={28}
                            height={28}
                            className="w-full h-full object-contain rounded"
                            unoptimized
                          />
                        ) : (
                          <span className="flex items-center justify-center font-bold text-xs text-blue-500">
                            {item.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/r/${item.slug}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-500 truncate block max-w-[150px] sm:max-w-xs"
                        >
                          {item.title}
                        </Link>
                        {hostname && (
                          <span className="text-[10px] text-slate-400 truncate block max-w-[150px] sm:max-w-xs">
                            {hostname}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 sm:px-4 hidden md:table-cell text-slate-500">
                    {item.category?.name || "General"}
                  </td>

                  {/* Clicks */}
                  <td className="py-3 px-3 sm:px-4 hidden sm:table-cell text-slate-500 font-mono">
                    {item.click_count || 0}
                  </td>

                  {/* Paid */}
                  <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ${displayAmount}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <button
                      onClick={() => onOutbidClick(item)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Outbid</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
