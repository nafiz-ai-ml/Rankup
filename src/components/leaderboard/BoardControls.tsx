"use client";

import * as React from "react";
import { Category } from "@/types/database";
import { LayoutList, LayoutGrid, Zap, Trophy } from "lucide-react";

interface BoardControlsProps {
  categories: Category[];
  activeBoard: "all-time" | "today";
  onBoardChange: (board: "all-time" | "today") => void;
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
}

export function BoardControls({
  categories,
  activeBoard,
  onBoardChange,
  selectedCategoryId,
  onCategorySelect,
  viewMode,
  onViewModeChange,
}: BoardControlsProps) {
  return (
    <div className="w-full space-y-4">
      {/* Top row: Board Toggle (All-time vs Today) & View Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Segmented Board Control Pill */}
        <div className="inline-flex items-center p-1 rounded-2xl glass-surface border border-slate-200 dark:border-white/10 shadow-sm">
          <button
            onClick={() => onBoardChange("all-time")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeBoard === "all-time"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>All-time</span>
          </button>

          <button
            onClick={() => onBoardChange("today")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
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

        {/* View Switcher: Card vs Table */}
        <div className="inline-flex items-center p-1 rounded-xl glass-surface border border-slate-200 dark:border-white/10">
          <button
            onClick={() => onViewModeChange("cards")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
            title="Card View"
            aria-label="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
            title="Table View"
            aria-label="Table View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Chips Bar (Horizontally scrollable with smooth gradient fade) */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 hide-scrollbar -mx-2 px-2 scroll-smooth">
          {/* "All" Chip */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
              selectedCategoryId === null
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                : "bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Products
          </button>

          {/* 20 Category Chips */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-semibold"
                    : "bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-white/10 hover:border-blue-500/40 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
