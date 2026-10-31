"use client";

import * as React from "react";
import Link from "next/link";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { useClaimModal } from "@/context/ClaimModalContext";
import { Listing } from "@/types/database";
import {
  Trophy,
  ChevronRight,
  Plus,
  LayoutGrid,
  Search,
} from "lucide-react";

export default function CategoriesPage() {
  const { openClaimModal } = useClaimModal();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [liveListings, setLiveListings] = React.useState<Listing[]>([]);

  React.useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch(`/api/listings?board=all-time&limit=100`, { cache: "no-store" });
        const data = await res.json();
        if (data && Array.isArray(data.listings)) {
          setLiveListings(data.listings);
        }
      } catch (err) {
        console.error("Categories live listings error:", err);
      }
    }
    loadListings();
  }, []);

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return MOCK_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description ? c.description.toLowerCase().includes(q) : false) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-8 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>20 SPECIALIZED ECOSYSTEM DIRECTORIES</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore All Categories
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Find the top-ranking products across autonomous AI agents, developer tools, SaaS, fintech, and creator apps. Each category maintains its own dedicated leaderboard.
            </p>
          </div>

          <button
            onClick={() => openClaimModal()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Claim in Any Category</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter categories (e.g. AI, SaaS, Dev Tools, Crypto)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* Categories Grid (20 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          // Find listings in this category
          const categoryListings = liveListings.filter(
            (item) => item.category_id === category.id || item.category?.slug === category.slug
          );
          const leader = categoryListings[0];

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="p-5 rounded-2xl glass-surface border border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <CategoryIcon
                      name={category.icon_name}
                      slug={category.slug}
                      className="w-5 h-5"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                    <span>Rankings</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Bottom stats pill */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">
                  {categoryListings.length} {categoryListings.length === 1 ? "product" : "products"} active
                </span>

                {leader ? (
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>#1 ${leader.spend?.all_time_total || 5}</span>
                  </span>
                ) : (
                  <span className="text-emerald-500 font-semibold">
                    #1 open for $5
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
