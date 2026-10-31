"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Zap,
  LayoutGrid,
  Menu,
  X,
  Trophy,
  History,
  BookOpen,
  Info,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { UtcCountdown } from "./UtcCountdown";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CategoryIcon } from "../categories/CategoryIcon";

interface MobileNavProps {
  onClaimClick?: () => void;
}

export function MobileNav({ onClaimClick }: MobileNavProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentBoard = searchParams.get("board");

  // Close drawer on path change
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      {/* 1. Mobile Fixed Top Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0E1424]/95 backdrop-blur-xl z-40 px-3 sm:px-4 flex items-center justify-between w-full max-w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-sm">
            <Image
              src="/brand/rankup-mark.svg"
              alt="Rankup"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Rank<span className="text-blue-500">up</span>
          </span>
        </Link>

        {/* Live Status Pill */}
        <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-indicator" />
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            Live • 17 online
          </span>
        </div>

        {/* Right Actions: Theme + Drawer Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {drawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Slide-out Mobile Navigation Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 flex transition-all duration-300 ${
          drawerOpen ? "pointer-events-auto opacity-100 visible" : "pointer-events-none opacity-0 invisible"
        }`}
      >
        {/* Backdrop: smooth fade in/out */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Drawer content: smooth, luxurious slide in from left */}
        <div
          className={`relative w-4/5 max-w-xs bg-white dark:bg-[#0E1424] h-full shadow-2xl p-4 sm:p-5 flex flex-col justify-between z-10 border-r border-slate-200 dark:border-white/10 overflow-y-auto transform transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Image
                  src="/brand/rankup-mark.svg"
                  alt="Rankup"
                  width={28}
                  height={28}
                />
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Rank<span className="text-blue-500">up</span>
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/" && !currentBoard
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Home className="w-4 h-4 text-blue-500" /> Home
              </Link>

              <Link
                href="/leaderboard?board=all-time"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/leaderboard" && currentBoard === "all-time"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-500" /> All-Time Leaderboard
              </Link>

              <Link
                href="/leaderboard?board=today"
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/leaderboard" && currentBoard === "today"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-emerald-500" /> Today&apos;s Board
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-500 text-white rounded-full">
                  LIVE
                </span>
              </Link>

              {/* Collapsible 20 Categories Section */}
              <div>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4 text-purple-500" />
                    <span>20 Categories</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      20
                    </span>
                    {categoriesOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {categoriesOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-white/10 space-y-0.5 max-h-56 overflow-y-auto hide-scrollbar py-1">
                    <Link
                      href="/categories"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LayoutGrid className="w-3.5 h-3.5 text-purple-500" />
                      <span>All Categories Directory</span>
                    </Link>
                    {MOCK_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 truncate"
                      >
                        <CategoryIcon name={cat.icon_name} slug={cat.slug} className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/archive"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname.startsWith("/archive")
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <History className="w-4 h-4 text-indigo-500" /> Daily Archive
              </Link>
              <Link
                href="/rules"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/rules" || pathname === "/faq"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <BookOpen className="w-4 h-4 text-slate-400" /> Rules & FAQ
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  pathname === "/about" || pathname === "/stats"
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Info className="w-4 h-4 text-slate-400" /> About & Stats
              </Link>
            </div>

            <div className="pt-2">
              <UtcCountdown />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3">
            <button
              onClick={() => {
                setDrawerOpen(false);
                onClaimClick?.();
              }}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Claim a Rank
            </button>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-200">Terms</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-200">Privacy</Link>
              <span>•</span>
              <Link href="/rules#refund-policy" className="hover:text-slate-600 dark:hover:text-slate-200">No Refund</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Navigation App Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 border-t border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-[#0E1424]/95 backdrop-blur-xl z-40 px-3 flex items-center justify-around w-full max-w-full">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            pathname === "/" && !currentBoard
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          href="/leaderboard?board=today"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            currentBoard === "today"
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Today</span>
        </Link>

        {/* Center Floating Claim Button */}
        <button
          onClick={onClaimClick}
          className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 active:scale-95 transition-all -translate-y-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Claim</span>
        </button>

        <Link
          href="/categories"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
            pathname.startsWith("/categories") || pathname.startsWith("/category/") || pathname.startsWith("/c/")
              ? "text-blue-600 dark:text-blue-400 font-bold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Categories</span>
        </Link>
      </nav>
    </>
  );
}
