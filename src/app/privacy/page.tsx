import * as React from "react";
import Link from "next/link";
import { Shield, Lock, ChevronLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — RankUp",
  description: "How RankUp respects your privacy with a zero-auth, minimal-data architecture.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 px-2 sm:px-4">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>ZERO-AUTH PRIVACY STANDARD</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 30, 2026. We prioritize minimal data collection and maximum transparency.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-lg space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* 1. Zero-Auth Commitment */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Zero-Auth Architecture</span>
          </h2>
          <p>
            RankUp does not require you to create an account, register a password, or submit personal identifiers to browse or rank your product. We do not maintain user profiles, social graph data, or private user messages.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No Password Database</span>
            </div>
            <p>
              Because we never collect passwords, there is zero risk of password credential leaks from our platform.
            </p>
          </div>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>2. Information We Collect & Process</span>
          </h2>
          <p>When you place a bid to rank a product, we process the following information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Public Product URL or X Handle:</strong> The destination you want visitors to be redirected to.</li>
            <li><strong>Public Metadata:</strong> Page title, meta description, and favicon parsed publicly via our OpenGraph scraper.</li>
            <li><strong>Transaction Record:</strong> Transaction amount, timestamp, and Paddle customer ID received through encrypted webhooks from Paddle.</li>
            <li><strong>Click Telemetry:</strong> Count of outbound clicks redirected through `/api/clicks/[id]`.</li>
          </ul>
        </section>

        {/* 3. Payment Processing */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>3. Payment Card Data Handling</span>
          </h2>
          <p>
            We do <strong>not</strong> collect, view, or store credit card numbers, CVVs, or billing addresses. All payment processing is conducted securely by <strong>Paddle.com</strong>, which complies with PCI-DSS Level 1 standards.
          </p>
        </section>

        {/* 4. Cookies */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>4. Cookies and Local Storage</span>
          </h2>
          <p>
            RankUp uses minimal browser storage solely for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Theme Preference:</strong> Remembering your Dark / Light mode toggle.</li>
            <li><strong>Admin Authentication:</strong> Secure encrypted HTTP-only session cookies strictly for authorized administrators.</li>
          </ul>
          <p>We do not use cross-site tracking cookies, behavioral tracking pixels, or third-party advertising cookies.</p>
        </section>

        {/* 5. Contact */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>5. Contact & Privacy Requests</span>
          </h2>
          <p>
            If you have questions about this policy or request removal of a public listing, contact our team or connect via our official social channels.
          </p>
        </section>
      </div>
    </div>
  );
}
