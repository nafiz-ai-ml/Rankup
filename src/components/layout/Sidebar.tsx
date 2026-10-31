"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Trophy,
  Zap,
  LayoutGrid,
  History,
  BookOpen,
  Info,
  ChevronRight,
  ChevronDown,
  Flame,
  Home,
} from "lucide-react";
import { UtcCountdown } from "./UtcCountdown";
import { ThemeToggle } from "../theme/ThemeToggle";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CategoryIcon } from "../categories/CategoryIcon";

interface SidebarProps {
  onClaimClick?: () => void;
}

export function Sidebar({ onClaimClick }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentBoard = searchParams.get("board");

  const isCategoriesActive =
    pathname.startsWith("/categories") || pathname.startsWith("/category/") || pathname.startsWith("/c/");

  const [categoriesOpen, setCategoriesOpen] = React.useState(isCategoriesActive);

  // Keep open if user navigates to category page
  React.useEffect(() => {
    if (isCategoriesActive) {
      setCategoriesOpen(true);
    }
  }, [isCategoriesActive]);

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/" && !currentBoard,
    },
    {
      label: "All-Time Board",
      href: "/leaderboard?board=all-time",
      icon: Trophy,
      isActive: pathname === "/leaderboard" && currentBoard === "all-time",
    },
    {
      label: "Today's Board",
      href: "/leaderboard?board=today",
      icon: Zap,
      badge: "LIVE",
      isActive:
        (pathname === "/leaderboard" && currentBoard === "today") ||
        (pathname === "/" && currentBoard === "today"),
    },
  ];

  const bottomNavItems = [
    {
      label: "Daily Archive",
      href: "/archive",
      icon: History,
      isActive: pathname.startsWith("/archive"),
    },
    {
      label: "Rules & FAQ",
      href: "/rules",
      icon: BookOpen,
      isActive: pathname === "/rules" || pathname === "/faq",
    },
    {
      label: "About & Stats",
      href: "/about",
      icon: Info,
      isActive: pathname === "/about" || pathname === "/stats",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0E1424]/95 backdrop-blur-xl z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-200/80 dark:border-white/10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-md">
              <Image
                src="/brand/rankup-mark.svg"
                alt="Rankup"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none text-slate-900 dark:text-white flex items-center">
                Rank<span className="text-blue-500">up</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Paid Public Leaderboard
              </span>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Live Indicator Pill */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Board Live
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            17 online
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 hide-scrollbar">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>

        {/* Primary nav items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                item.isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    item.isActive
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-red-500 text-white tracking-wider animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* 20 Categories Menu Item with Expandable Sub-items */}
        <div className="pt-1">
          <div
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
              isCategoriesActive && !categoriesOpen
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setCategoriesOpen(!categoriesOpen)}
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
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform" />
              )}
            </div>
          </div>

          {/* Sub-menu: 20 Categories with unique icons */}
          {categoriesOpen && (
            <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-white/10 space-y-0.5 max-h-72 overflow-y-auto hide-scrollbar py-1">
              {/* Link to all categories directory */}
              <Link
                href="/categories"
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                  pathname === "/categories"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
                }`}
              >
                <LayoutGrid className="w-3 h-3 text-purple-500" />
                <span>All Categories Directory</span>
              </Link>

              {/* Each category with unique icon */}
              {MOCK_CATEGORIES.map((cat) => {
                const isCatActive =
                  pathname === `/category/${cat.slug}` || pathname === `/c/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors group ${
                      isCatActive
                        ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CategoryIcon
                        name={cat.icon_name}
                        slug={cat.slug}
                        className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                          isCatActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-blue-500"
                        }`}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Secondary nav items */}
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                item.isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    item.isActive
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        {/* Micro Section: Quick Live Stats */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 px-2">
          <div className="p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Current #1
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                $102 USD
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-blue-500 h-full w-[70%] rounded-full" />
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Claim #1 right now for <strong className="text-blue-500">$104</strong>
            </div>
          </div>
        </div>

        {/* UTC Reset Countdown */}
        <div className="pt-2 px-1">
          <UtcCountdown />
        </div>
      </div>

      {/* Sidebar Sticky Footer & Primary CTA */}
      <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col gap-3">
        {/* Primary Action Button */}
        <button
          onClick={onClaimClick}
          className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Claim a Rank</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Footer info & Theme Switcher */}
        <div className="flex items-center justify-between pt-1">
          <ThemeToggle />
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            <Link href="/terms" className="hover:text-blue-500">
              Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-blue-500">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
