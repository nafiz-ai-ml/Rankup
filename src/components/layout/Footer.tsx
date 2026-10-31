"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Zap,
  LayoutGrid,
  History,
  BookOpen,
  Info,
  ShieldCheck,
  ArrowUp,
  ExternalLink,
  Lock,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CategoryIcon } from "../categories/CategoryIcon";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topCategories = MOCK_CATEGORIES.slice(0, 6);

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#0A0E1A]/90 backdrop-blur-md transition-colors mt-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Header / Live strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-10 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md">
              <Image
                src="/brand/rankup-mark.svg"
                alt="Rankup"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
                Rank<span className="text-blue-500">up</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The open paid public leaderboard for modern products & founders.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />
              <span>Leaderboard Live • Real-time Math</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500 transition-colors shadow-sm cursor-pointer"
              title="Back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-column Navigation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {/* Col 1: Platform Overview */}
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              About Rankup
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Rankup replaces algorithmic bias, subjective curation, and payola with pure mathematical transparency. Products rank strictly by what they pay.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>7 Days Visibility Guaranteed</span>
            </div>
          </div>

          {/* Col 2: Core Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard?board=all-time"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>All-Time Leaderboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard?board=today"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Today&apos;s Board (LIVE)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-purple-500" />
                  <span>20 Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/archive"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <History className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Daily Archive</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Rules & FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About & Live Stats</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {topCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-2"
                  >
                    <CategoryIcon name={c.icon_name} slug={c.slug} className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{c.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-blue-500 font-semibold hover:underline flex items-center gap-1 pt-1"
                >
                  <span>View all 20 categories →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Rules & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/rules#refund-policy"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                >
                  Strict No-Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/rules#sponsored-disclosure"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                >
                  Sponsored Placement Notice
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Moderation</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Security Strip */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Rankup. All rights reserved. Zero organic bias.</p>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Verified Paddle Billing
            </span>
            <span>•</span>
            <span className="text-slate-400">Postgres on Supabase</span>
            <span>•</span>
            <span className="text-slate-400">256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

