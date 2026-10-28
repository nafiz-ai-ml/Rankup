"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Edit2,
  Archive,
  Trash2,
  Ban,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";
import { Listing, Category } from "@/types/database";
import { MOCK_CATEGORIES } from "@/lib/mockData";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, startTransition] = useTransition();

  // Edit modal state
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Toast / notification
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchListings = async () => {
    try {
      const url = new URL("/api/admin/listings", window.location.origin);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
      }
    } catch {
      setNotice({ type: "error", text: "Failed to load listings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    setEditTitle(listing.title);
    setEditDesc(listing.short_description || "");
    setEditImage(listing.image_url || "");
    setEditCategory(listing.category_id || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;

    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingListing.id,
          title: editTitle,
          short_description: editDesc,
          image_url: editImage || null,
          category_id: editCategory,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setNotice({ type: "success", text: `Updated "${editTitle}" successfully.` });
      setEditingListing(null);
      fetchListings();
    } catch {
      setNotice({ type: "error", text: "Failed to update listing." });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleForceArchive = async (listing: Listing) => {
    if (!confirm(`Force-archive "${listing.title}" immediately?`)) return;

    try {
      const res = await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, status: "archived" }),
      });

      if (res.ok) {
        setNotice({ type: "success", text: `"${listing.title}" moved to archived.` });
        fetchListings();
      }
    } catch {
      setNotice({ type: "error", text: "Failed to archive listing." });
    }
  };

  const handleHardRemove = async (listing: Listing) => {
    if (!confirm(`Are you sure you want to remove "${listing.title}"? It will be hidden from the public leaderboard.`))
      return;

    try {
      const res = await fetch(`/api/admin/listings?id=${listing.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNotice({ type: "success", text: `"${listing.title}" was removed.` });
        fetchListings();
      }
    } catch {
      setNotice({ type: "error", text: "Failed to remove listing." });
    }
  };

  const handleBlacklistDomain = async (listing: Listing) => {
    const domain = listing.destination_url
      ? new URL(listing.destination_url.startsWith("http") ? listing.destination_url : `https://${listing.destination_url}`).hostname.toLowerCase()
      : listing.x_handle;

    if (!domain) return;
    if (!confirm(`Add "${domain}" to platform blacklist and remove this listing?`)) return;

    try {
      // 1. Add to blacklist
      await fetch("/api/admin/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pattern: domain,
          type: listing.destination_type === "x_profile" ? "x_handle" : "domain",
          reason: `Blacklisted from Admin Listings UI by moderation action on ${listing.title}`,
        }),
      });

      // 2. Remove listing
      await fetch(`/api/admin/listings?id=${listing.id}`, { method: "DELETE" });

      setNotice({ type: "success", text: `Blacklisted domain "${domain}" and removed listing.` });
      fetchListings();
    } catch {
      setNotice({ type: "error", text: "Failed to blacklist domain." });
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
          <h1 className="text-2xl font-black text-white tracking-tight">Listings Moderation</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, edit metadata, force-archive, or ban malicious destinations.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            fetchListings();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="admin-search-listings"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Title, URL, X handle, ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:block" />
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "archived", label: "Archived" },
            { id: "pending_payment", label: "Pending" },
            { id: "removed", label: "Removed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Spend</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Clicks</th>
                <th className="py-3.5 px-4">Expires</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching listings...
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No listings found matching filter criteria.
                  </td>
                </tr>
              ) : (
                listings.map((item) => {
                  const statusColors: Record<string, string> = {
                    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    archived: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    pending_payment: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    removed: "bg-red-500/10 text-red-400 border-red-500/20",
                  };

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                            {item.favicon_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.favicon_url}
                                alt={item.title}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-xs font-bold text-slate-400">
                                {item.title[0]}
                              </span>
                            )}
                          </div>
                          <div className="max-w-[200px] sm:max-w-xs">
                            <div className="font-semibold text-slate-100 truncate flex items-center gap-1.5">
                              {item.title}
                              <Link
                                href={`/r/${item.slug}`}
                                target="_blank"
                                className="text-slate-500 hover:text-blue-400"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.destination_url || `@${item.x_handle}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                          {item.category?.name || "General"}
                        </span>
                      </td>

                      {/* Spend */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">
                          ${item.spend?.all_time_total || 0}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Today: ${item.spend?.today_total || 0}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            statusColors[item.status] || "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Clicks */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-200">
                        {item.click_count || 0}
                      </td>

                      {/* Expires */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit button */}
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Edit Metadata"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Force archive */}
                          {item.status === "active" && (
                            <button
                              onClick={() => handleForceArchive(item)}
                              title="Force Archive"
                              className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-amber-500/20 transition-colors"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Hard Remove */}
                          {item.status !== "removed" && (
                            <button
                              onClick={() => handleHardRemove(item)}
                              title="Hard Remove"
                              className="p-1.5 rounded-lg bg-slate-800 text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Blacklist Domain */}
                          <button
                            onClick={() => handleBlacklistDomain(item)}
                            title="Blacklist Domain"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Metadata Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingListing(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1">Edit Listing Metadata</h2>
            <p className="text-xs text-slate-400 mb-5">
              Modify promotional title, pitch copy, or category assignment.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Short Description / Pitch
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <CustomSelect
                  options={MOCK_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
                  value={editCategory}
                  onChange={setEditCategory}
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
