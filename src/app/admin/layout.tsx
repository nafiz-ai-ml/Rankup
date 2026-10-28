import React from "react";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin Portal — Rankup",
  description: "Administrative control center for Rankup moderation and payments",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
