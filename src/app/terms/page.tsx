import * as React from "react";
import Link from "next/link";
import { Shield, FileText, ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — RankUp",
  description: "Terms and conditions governing the use of RankUp paid public leaderboard.",
};

export default function TermsPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          <span>LEGAL AGREEMENT</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Last updated: October 30, 2026. Please read these terms carefully before claiming a rank on RankUp.
        </p>
      </div>

      {/* Content Sections */}
      <div className="p-6 sm:p-8 rounded-3xl glass-surface border border-slate-200/90 dark:border-white/10 shadow-lg space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* 1. Acceptance */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing RankUp (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;) or purchasing a placement on our leaderboards, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use or bid on the platform.
          </p>
        </section>

        {/* 2. Paid Mathematical Ranking Nature */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>2. Nature of the Service & Sponsored Advertising</span>
          </h2>
          <p>
            RankUp is a 100% pay-to-rank advertising platform. Rankings are determined purely by mathematical calculation based on cumulative spend verified by our Merchant of Record.
          </p>
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1.5 text-blue-900 dark:text-blue-200 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>FTC Sponsored Advertising Disclosure</span>
            </div>
            <p>
              Rank position does NOT indicate an editorial endorsement, safety review, quality guarantee, or organic recommendation by RankUp. All listings are considered paid promotional placement.
            </p>
          </div>
        </section>

        {/* 3. Merchant of Record & Payments */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>3. Merchant of Record & Paddle Billing</span>
          </h2>
          <p>
            Our order process is conducted by our online reseller and Merchant of Record, <strong>Paddle.com Market Ltd</strong> (&quot;Paddle&quot;). Paddle provides customer service inquiries and handles sales tax, VAT, and fraud management for all transactions.
          </p>
        </section>

        {/* 4. Strict Non-Refundable Policy */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>4. Strict No-Refund Policy</span>
          </h2>
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2 text-red-900 dark:text-red-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>All sales are final</span>
            </div>
            <p>
              Because visibility, outbound click tracking, and rank positioning are delivered instantly upon receipt of payment via server webhook, services are considered fully rendered the moment payment is verified. Chargebacks, fraudulent disputes, or bad-faith claims will result in immediate permanent domain and handle blacklisting across RankUp.
            </p>
          </div>
        </section>

        {/* 5. 7-Day Guarantee & 15-Minute Boost Window */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>5. Visibility Window & Boost Rules</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>7-Day Active Period:</strong> Every qualifying payment grants 7 consecutive days of active visibility on the category and global leaderboards.
            </li>
            <li>
              <strong>Outbid Reality:</strong> Paying for a spot guarantees visibility, but does not guarantee immunity from being outbid by another competitor placing a higher bid.
            </li>
            <li>
              <strong>15-Minute Boost Window:</strong> If a listing is outbid within 15 minutes of payment confirmation, the owner may reclaim their previous rank by paying only the bid difference plus a minimum of $2 USD.
            </li>
          </ul>
        </section>

        {/* 6. Prohibited Content */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>6. Prohibited Content & Blacklist Policy</span>
          </h2>
          <p>
            You agree not to submit destinations containing or linking to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Malware, viruses, phishing, or deceptive financial schemes.</li>
            <li>Illegal substances, unauthorized firearms, or darknet services.</li>
            <li>Adult/pornographic content, hate speech, or harassment.</li>
          </ul>
          <p>
            We reserve the absolute right to remove any violating listing without notice and without refund.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>7. Limitation of Liability</span>
          </h2>
          <p>
            RankUp does not guarantee specific outbound click counts, conversions, revenue, or business results. The platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
          </p>
        </section>
      </div>
    </div>
  );
}
