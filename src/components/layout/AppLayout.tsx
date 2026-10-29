"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";
import { ClaimModalProvider, useClaimModal } from "@/context/ClaimModalContext";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { openClaimModal } = useClaimModal();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const handleClaimClick = () => {
    openClaimModal();
  };

  // Dedicated shell for admin routes (AdminShell provides its own navigation)
  if (isAdmin) {
    return <div className="min-h-screen w-full max-w-full overflow-x-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--bg-body)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {/* 1. Desktop Persistent Left Sidebar wrapped in Suspense */}
      <React.Suspense
        fallback={
          <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-white/10" />
        }
      >
        <Sidebar onClaimClick={handleClaimClick} />
      </React.Suspense>

      {/* 2. Mobile Header, Drawer & Bottom App Bar wrapped in Suspense */}
      <React.Suspense
        fallback={
          <div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-950 border-b border-white/10" />
        }
      >
        <MobileNav onClaimClick={handleClaimClick} />
      </React.Suspense>

      {/* 3. Main Content Canvas & Unified Global Footer */}
      <div className="lg:pl-64 flex flex-col min-h-screen pt-14 lg:pt-0 pb-16 lg:pb-0 w-full max-w-full overflow-x-hidden">
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 overflow-x-hidden">
          {children}
        </main>

        {/* Global Consistent Luxury Footer */}
        <Footer />
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClaimModalProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-[var(--bg-body)]" />}>
        <AppLayoutContent>{children}</AppLayoutContent>
      </React.Suspense>
    </ClaimModalProvider>
  );
}
