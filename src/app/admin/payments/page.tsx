"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  RotateCcw,
  RefreshCw,
  X,
  Loader2,
  Check,
  AlertCircle,
  Copy,
} from "lucide-react";
import { Payment } from "@/types/database";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayload, setSelectedPayload] = useState<Payment | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch {
      setNotice({ type: "error", text: "Failed to load payment logs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRetry = async (payment: Payment) => {
    setRetryingId(payment.id);
    try {
      const res = await fetch("/api/admin/payments/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: payment.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Retry failed");
      }

      setNotice({
        type: "success",
        text: `Payment ${payment.id} re-processed: ${data.message}`,
      });
      fetchPayments();
    } catch (err: unknown) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to retry payment.",
      });
    } finally {
      setRetryingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-2xl font-black text-white tracking-tight">Payments & Webhook Audits</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Paddle V2 webhook transactions, raw payload inspector, and idempotent manual replay.
          </p>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            fetchPayments();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-[#111827]/70 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Event ID / Txn</th>
                <th className="py-3.5 px-4">Customer Email</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading payment audit log...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No webhook payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const isSucceeded = p.status === "succeeded";
                  const isFailed = p.status === "failed";

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Event / Txn ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] text-slate-200">
                          {p.paddle_event_id || p.id}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {p.paddle_transaction_id || "Direct"}
                        </div>
                      </td>

                      {/* Customer Email */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.paddle_customer_email || "Anonymous"}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        ${p.amount_usd}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            isSucceeded
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : isFailed
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {isSucceeded && <CheckCircle2 className="w-3 h-3" />}
                          {isFailed && <AlertTriangle className="w-3 h-3" />}
                          {!isSucceeded && !isFailed && <Clock className="w-3 h-3" />}
                          {p.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(p.created_at).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Inspect Payload Drawer */}
                          <button
                            onClick={() => setSelectedPayload(p)}
                            title="Inspect JSON Payload"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-[11px]"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            Inspect
                          </button>

                          {/* Manual Retry */}
                          {(!isSucceeded || p.status === "failed") && (
                            <button
                              onClick={() => handleRetry(p)}
                              disabled={retryingId === p.id}
                              title="Manual Retry via process_successful_payment"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors text-[11px] disabled:opacity-50"
                            >
                              <RotateCcw
                                className={`w-3.5 h-3.5 ${
                                  retryingId === p.id ? "animate-spin" : ""
                                }`}
                              />
                              Retry
                            </button>
                          )}
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

      {/* Raw Payload Inspector Modal / Drawer */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  Webhook Payload Inspector
                </h2>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: {selectedPayload.paddle_event_id || selectedPayload.id}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(selectedPayload.raw_payload || selectedPayload, null, 2)
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy JSON"}
                </button>
                <button
                  onClick={() => setSelectedPayload(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* JSON Viewer */}
            <div className="flex-1 overflow-y-auto mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(selectedPayload.raw_payload || selectedPayload, null, 2)}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Status: {selectedPayload.status}</span>
              <span>Amount: ${selectedPayload.amount_usd} USD</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
