"use client";

import * as React from "react";
import { Clock } from "lucide-react";

export function UtcCountdown() {
  const [timeLeft, setTimeLeft] = React.useState<string>("00:00:00");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    function updateCountdown() {
      const now = new Date();
      // Calculate target: next 00:00:00 UTC
      const nextUtcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
      ));

      const diffMs = nextUtcMidnight.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-slate-900/60 text-xs">
      <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
      <span className="text-slate-500 dark:text-slate-400 font-medium">UTC Reset:</span>
      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tracking-wider">
        {mounted ? timeLeft : "--:--:--"}
      </span>
    </div>
  );
}
