"use client";

import * as React from "react";
import { Globe, AtSign, ArrowRight, X } from "lucide-react";
import { Category } from "@/types/database";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface HeroClaimBarProps {
  categories: Category[];
  initialValue?: string;
  initialCategory?: string;
  onSubmit: (destination: string, categoryId: string) => void;
}

export function HeroClaimBar({
  categories,
  initialValue = "",
  initialCategory = "",
  onSubmit,
}: HeroClaimBarProps) {
  const [destination, setDestination] = React.useState(initialValue);
  const [selectedCategory, setSelectedCategory] = React.useState(
    initialCategory || (categories[0]?.id ?? "")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit(destination.trim(), selectedCategory);
  };

  const isHandle = destination.startsWith("@") || destination.includes("x.com/") || destination.includes("twitter.com/");

  return (
    <form
      id="hero-claim-input"
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto px-1 sm:px-0"
    >
      <div className="p-2 sm:p-2.5 rounded-2xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-xl shadow-blue-500/5 hover:border-blue-500/40 transition-all duration-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        {/* Input field with icon */}
        <div className="relative flex-1 flex items-center min-w-0 w-full">
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            {isHandle ? (
              <AtSign className="w-4 h-4 text-blue-500 transition-transform" />
            ) : (
              <Globe className="w-4 h-4 text-slate-400 transition-transform" />
            )}
          </div>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Your product website URL or @handle"
            className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent hover:border-slate-200 dark:hover:border-white/5 transition-all"
            required
          />
          {destination && (
            <button
              type="button"
              onClick={() => setDestination("")}
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category selector */}
        <div className="w-full sm:w-56 shrink-0">
          <CustomSelect
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="!py-3 !rounded-xl w-full"
            menuClassName="w-full"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer group"
        >
          <span>Claim rank</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Trust micro-row */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-medium px-2">
        <span>Minimum bid: $5</span>
        <span>•</span>
        <span>#1 Takeover: Leader + $2</span>
        <span>•</span>
        <span>7 days active visibility</span>
        <span>•</span>
        <span>Non-refundable</span>
      </div>
    </form>
  );
}
