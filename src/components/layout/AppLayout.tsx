"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { ClaimModalProvider, useClaimModal } from "@/context/ClaimModalContext";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { openClaimModal } = useClaimModal();

  const handleClaimClick = () => {
    openClaimModal();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] transition-colors duration-200">
      {/* 1. Desktop Persistent Left Sidebar wrapped in Suspense */}
      <React.Suspense fallback={<div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-white/10" />}>
        <Sidebar onClaimClick={handleClaimClick} />
      </React.Suspense>

      {/* 2. Mobile Header, Drawer & Bottom App Bar wrapped in Suspense */}
      <React.Suspense fallback={<div className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-950 border-b border-white/10" />}>
        <MobileNav onClaimClick={handleClaimClick} />
      </React.Suspense>

      {/* 3. Main Content Canvas */}
      <div className="lg:pl-64 flex flex-col min-h-screen pt-14 lg:pt-0 pb-20 lg:pb-0">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClaimModalProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </ClaimModalProvider>
  );
}
