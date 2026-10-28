"use client";

import * as React from "react";
import Image from "next/image";
import { Category, Listing } from "@/types/database";
import { ScrapedMetadata } from "@/lib/scraper/extractor";
import {
  X,
  Globe,
  AtSign,
  Loader2,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialDestination?: string;
  initialCategoryId?: string;
  currentListings: Listing[];
  onProceedToCheckout?: (data: {
    destination: string;
    type: "website" | "x_profile";
    title: string;
    description: string;
    faviconUrl: string;
    categoryId: string;
    bidAmount: number;
    targetRank: number;
  }) => void;
}

export function ClaimModal({
  isOpen,
  onClose,
  categories,
  initialDestination = "",
  initialCategoryId = "",
  currentListings,
  onProceedToCheckout,
}: ClaimModalProps) {
  // Step state: 1 (Destination) -> 2 (Metadata Preview/Edit) -> 3 (Category & Bid) -> 4 (Checkout trigger)
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [destination, setDestination] = React.useState(initialDestination);
  const [selectedCategory, setSelectedCategory] = React.useState(
    initialCategoryId || (categories[0]?.id ?? "")
  );

  // Scraped metadata state
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scrapedData, setScrapedData] = React.useState<ScrapedMetadata | null>(null);

  // Editable fields for Step 2
  const [editableTitle, setEditableTitle] = React.useState("");
  const [editableDescription, setEditableDescription] = React.useState("");

  // Bid state for Step 3
  const [bidAmount, setBidAmount] = React.useState<number>(5);

  // Sync initial values when modal opens or initial props change
  React.useEffect(() => {
    if (isOpen) {
      if (initialDestination) {
        setDestination(initialDestination);
      }
      if (initialCategoryId) {
        setSelectedCategory(initialCategoryId);
      }
      setError(null);
    }
  }, [isOpen, initialDestination, initialCategoryId]);

  if (!isOpen) return null;

  // Calculate ranks and required amounts based on current listings
  const rank1Spend = currentListings[0]?.spend?.today_total ?? currentListings[0]?.spend?.all_time_total ?? 0;
  const rank2Spend = currentListings[1]?.spend?.today_total ?? currentListings[1]?.spend?.all_time_total ?? 0;
  const rank3Spend = currentListings[2]?.spend?.today_total ?? currentListings[2]?.spend?.all_time_total ?? 0;

  const takeRank1Price = Math.max(5, rank1Spend + 2);
  const takeRank2Price = Math.max(5, rank2Spend + 1);
  const takeRank3Price = Math.max(5, rank3Spend + 1);

  // Calculate predicted rank for current bid amount
  const calculatePredictedRank = (amount: number) => {
    if (amount >= takeRank1Price) return 1;
    if (amount >= takeRank2Price) return 2;
    if (amount >= takeRank3Price) return 3;

    let foundRank = currentListings.length + 1;
    for (let i = 0; i < currentListings.length; i++) {
      const itemSpend = currentListings[i].spend?.today_total ?? currentListings[i].spend?.all_time_total ?? 0;
      if (amount > itemSpend) {
        foundRank = i + 1;
        break;
      }
    }
    return foundRank;
  };

  const predictedRank = calculatePredictedRank(bidAmount);

  // Step 1: Handle Destination Submit & Scraping
  const handleDestinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/metadata/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: destination.trim() }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch metadata.");
      }

      setScrapedData(data.metadata);
      setEditableTitle(data.metadata.title);
      setEditableDescription(data.metadata.description);

      // Pre-set bid to take #1 or min $5
      setBidAmount(takeRank1Price);

      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Handle Final Checkout Trigger
  const handleFinalCheckout = () => {
    if (!scrapedData) return;

    if (onProceedToCheckout) {
      onProceedToCheckout({
        destination: scrapedData.cleanUrl,
        type: scrapedData.destinationType,
        title: editableTitle.trim() || scrapedData.title,
        description: editableDescription.trim() || scrapedData.description,
        faviconUrl: scrapedData.faviconUrl,
        categoryId: selectedCategory,
        bidAmount,
        targetRank: predictedRank,
      });
    } else {
      alert(`Proceeding to Paddle Checkout for $${bidAmount} to claim Rank #${predictedRank}!`);
      onClose();
    }
  };

  const isHandle = destination.startsWith("@") || destination.includes("x.com/") || destination.includes("twitter.com/");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-all animate-in fade-in">
      {/* Modal Dialog Card (Centered Desktop, Bottom Sheet Mobile) */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E1424] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="p-1 -ml-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Claim Your Rank</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Step {step} of 3
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {step === 1 && "Enter product website or X profile handle"}
                {step === 2 && "Preview and customize listing details"}
                {step === 3 && "Select category and choose your bid amount"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 hide-scrollbar">
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: DESTINATION INPUT */}
          {/* ============================================================ */}
          {step === 1 && (
            <form onSubmit={handleDestinationSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Website URL or X Handle
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400">
                    {isHandle ? (
                      <AtSign className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Globe className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="https://example.com or @username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  We automatically fetch OpenGraph title, description, and high-resolution favicon.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <CustomSelect
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !destination.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fetching Metadata...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Preview</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 2: METADATA PREVIEW & EDIT */}
          {/* ============================================================ */}
          {step === 2 && scrapedData && (
            <div className="space-y-4">
              {/* Duplicate Notice if already on leaderboard */}
              {scrapedData.isDuplicate && (
                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Active Listing Detected: </span>
                    This destination already has an active placement. Proceeding will Boost its existing rank and reset its 7-day visibility!
                  </div>
                </div>
              )}

              {/* Scraped Card Preview Box */}
              <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified OpenGraph Metadata</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={scrapedData.faviconUrl}
                      alt={editableTitle || "Favicon"}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain rounded"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {editableTitle || "No Title"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {editableDescription || "No Description"}
                    </div>
                    <div className="text-[11px] text-blue-500 mt-1 truncate">
                      {scrapedData.cleanUrl}
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <label>Display Title</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editableTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Editable Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <label>Tagline / Description</label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {editableDescription.length}/140
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={140}
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Confirm & Choose Bid</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: CATEGORY & BID SELECTION */}
          {/* ============================================================ */}
          {step === 3 && scrapedData && (
            <div className="space-y-5">
              {/* Category Confirmation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Listing Category
                </label>
                <CustomSelect
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>

              {/* Dynamic Achievable Rank Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white space-y-1 shadow-lg shadow-blue-500/25">
                <div className="flex items-center justify-between text-xs font-semibold opacity-90">
                  <span>Projected Leaderboard Rank</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    Instant Placement
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <div className="font-mono font-black text-3xl sm:text-4xl">
                    Rank #{predictedRank}
                  </div>
                  <div className="font-mono font-bold text-xl text-blue-100">
                    ${bidAmount} USD
                  </div>
                </div>
                <div className="text-[11px] opacity-80 pt-1">
                  {predictedRank === 1
                    ? "🏆 You will claim the #1 spot on today's leaderboard!"
                    : `Places you ahead of ${Math.max(0, currentListings.length - predictedRank + 1)} competing listings.`}
                </div>
              </div>

              {/* Bid Quick Select Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select or Enter Bid Amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setBidAmount(takeRank1Price)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      bidAmount === takeRank1Price
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold shadow-sm"
                        : "border-slate-200 dark:border-white/10 hover:border-blue-500/40 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-amber-500">Take #1</div>
                    <div className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">${takeRank1Price}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBidAmount(takeRank2Price)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      bidAmount === takeRank2Price
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "border-slate-200 dark:border-white/10 hover:border-blue-500/40 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Take #2</div>
                    <div className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">${takeRank2Price}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBidAmount(takeRank3Price)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      bidAmount === takeRank3Price
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "border-slate-200 dark:border-white/10 hover:border-blue-500/40 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Take #3</div>
                    <div className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">${takeRank3Price}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBidAmount(5)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      bidAmount === 5
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                        : "border-slate-200 dark:border-white/10 hover:border-blue-500/40 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Minimum</div>
                    <div className="font-mono font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">$5</div>
                  </button>
                </div>

                {/* Custom Bid Input */}
                <div className="pt-1">
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-mono font-bold text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      min={5}
                      max={99999}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Math.max(5, parseInt(e.target.value || "5", 10)))}
                      className="w-full pl-8 pr-16 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute right-3.5 text-xs font-semibold text-slate-400">USD</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Strip */}
              <div className="p-3 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Included with your placement:</span>
                </div>
                <div>• 7 days of active visibility before archival</div>
                <div>• 15-minute Boost Window with discounted reclaim rights</div>
              </div>

              {/* Final Submit Button */}
              <button
                type="button"
                onClick={handleFinalCheckout}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ${bidAmount} via Paddle Checkout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
