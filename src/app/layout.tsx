import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Rankup — Claim your rank. Paid public leaderboard.",
  description:
    "Rankup is a fully paid, zero-auth public leaderboard where founders, SaaS companies, AI products, and creators claim ranks starting at $5.",
  icons: {
    icon: "/brand/favicon.ico",
    shortcut: "/brand/favicon-32.png",
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
