"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Layers,
  Zap,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Payment } from "@/types/database";

interface StatsData {
  grossRevenue: number;
  todayRevenue: number;
  activeListings: number;
  totalListings: number;
  avgSpend: number;
  boostConversionRate: number;
  categoryBreakdown: { name: string; count: number; spend: number }[];
  recentPayments: Payment[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-sm text-slate-400">Loading platform metrics...</span>
      </div>
    );
  }

  const grossRev = stats?.grossRevenue || 0;
  const todayRev = stats?.todayRevenue || 0;
  const activeCount = stats?.activeListings || 0;
  const avgSpend = stats?.avgSpend || 0;
  const boostRate = stats?.boostConversionRate || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Platform Overview</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time financial telemetry, active placements, and conversion analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            Refresh Data
          </button>
          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            Manage Listings
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gross Revenue */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">${grossRev.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3" />
            All-time platform volume
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Today&apos;s Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">${todayRev.toLocaleString()}</div>
          <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1 mt-1.5">
            Since 00:00:00 UTC
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Active Placements</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">{activeCount}</div>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1.5">
            7-day visibility lifecycle
          </div>
        </div>

        {/* Average Spend */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Avg / Listing</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">${avgSpend}</div>
          <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 mt-1.5">
            Mean cumulative bid
          </div>
        </div>

        {/* Boost Window Conversion */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase">Boost Window CR</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-400 tracking-tight">{boostRate}%</div>
          <div className="text-[11px] text-purple-400 font-medium flex items-center gap-1 mt-1.5">
            15m window reclaim rate
          </div>
        </div>
      </div>

      {/* Main Grid: Category Breakdown + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Performance Breakdown */}
        <div className="lg:col-span-2 bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Category Revenue Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">Top niches driving competitive outbidding</p>
            </div>
            <span className="text-xs text-slate-500">Cumulative Spend</span>
          </div>

          <div className="space-y-4">
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              stats.categoryBreakdown.slice(0, 5).map((cat, idx) => {
                const maxSpend = stats.categoryBreakdown[0]?.spend || 1;
                const percentage = Math.round((cat.spend / maxSpend) * 100);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-400">
                          {idx + 1}
                        </span>
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{cat.count} listings</span>
                        <span className="font-bold text-white">${cat.spend}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">No categories active.</div>
            )}
          </div>
        </div>

        {/* Quick Health & Moderation Checklist */}
        <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">System Guardrails</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Advisory Transaction Lock</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    pg_advisory_xact_lock(918273645) prevents race conditions.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">HMAC-SHA256 Webhooks</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Paddle-Signature verification rejects replayed payloads.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-200">Cron Expiry Engine</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    5-minute archival worker & midnight UTC daily reset active.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <Link
              href="/admin/blacklist"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Inspect Blacklist Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
