"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Plus,
  Trash2,
  Globe,
  AtSign,
  FileCode,
  RefreshCw,
  X,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { BlacklistItem } from "@/types/database";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function AdminBlacklistPage() {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pattern, setPattern] = useState("");
  const [type, setType] = useState<"domain" | "x_handle" | "keyword">("domain");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchBlacklist = async () => {
    try {
      const res = await fetch("/api/admin/blacklist");
      if (res.ok) {
        const data = await res.json();
        setBlacklist(data.blacklist || []);
      }
    } catch {
      setNotice({ type: "error", text: "Failed to load blacklist rules." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlacklist();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pattern.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: pattern.trim(), type, reason }),
      });

      if (!res.ok) throw new Error("Failed to create rule");

      setNotice({ type: "success", text: `Added "${pattern}" to blacklist.` });
      setShowAddModal(false);
      setPattern("");
      setReason("");
      fetchBlacklist();
    } catch {
      setNotice({ type: "error", text: "Failed to create blacklist rule." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: BlacklistItem) => {
    if (!confirm(`Delete blacklist rule for "${item.pattern}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blacklist?id=${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotice({ type: "success", text: `Removed "${item.pattern}" from blacklist.` });
        fetchBlacklist();
      }
    } catch {
      setNotice({ type: "error", text: "Failed to delete blacklist rule." });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
            notice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notice.text}</span>
          </div>
          <button onClick={() => setNotice(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Blacklist & Moderation Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Banned domain patterns, malicious X handles, and prohibited keyword regexes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setLoading(true);
              fetchBlacklist();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Pattern / Target</th>
                <th className="py-3.5 px-4">Rule Type</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading blacklist definitions...
                  </td>
                </tr>
              ) : blacklist.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No active blacklist rules configured.
                  </td>
                </tr>
              ) : (
                blacklist.map((item) => {
                  const typeIcons: Record<string, React.ReactNode> = {
                    domain: <Globe className="w-3.5 h-3.5 text-blue-400" />,
                    x_handle: <AtSign className="w-3.5 h-3.5 text-sky-400" />,
                    keyword: <FileCode className="w-3.5 h-3.5 text-purple-400" />,
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Pattern */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">
                          {item.pattern}
                        </span>
                      </td>

                      {/* Rule Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {typeIcons[item.type] || <Globe className="w-3.5 h-3.5" />}
                          {item.type.toUpperCase()}
                        </span>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {item.reason || "Violates community or provider terms"}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(item)}
                          title="Delete Rule"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Add Blacklist Rule</h2>
            <p className="text-xs text-slate-400 mb-5">
              Prevent spam bots and prohibited domains from submitting claim bids.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rule Type</label>
                <CustomSelect
                  options={[
                    { value: "domain", label: "Domain Name (e.g., bit.ly, *.t.me)", icon: <Globe className="w-4 h-4 text-blue-400" /> },
                    { value: "x_handle", label: "X Profile Handle (e.g., scammer_bot)", icon: <AtSign className="w-4 h-4 text-sky-400" /> },
                    { value: "keyword", label: "Prohibited Regex Pattern", icon: <FileCode className="w-4 h-4 text-purple-400" /> },
                  ]}
                  value={type}
                  onChange={(v) => setType(v as "domain" | "x_handle" | "keyword")}
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pattern</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder={
                    type === "domain"
                      ? "malicious-site.com"
                      : type === "x_handle"
                      ? "crypto_doubler"
                      : "(ponzi|doubler)"
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason / Notes</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g., Direct chat invite link bypass or phishing"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
