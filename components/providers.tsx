"use client";

import { ThemeProvider } from "next-themes";
import { WatchlistProvider } from "@/components/watchlist/WatchlistProvider";

/* ============================================================
   Client providers — theme + local watchlist.
   Kept in one boundary so the rest of the app can stay on the
   server. The attribute is data-theme, matching globals.css.
   ============================================================ */

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <WatchlistProvider>{children}</WatchlistProvider>
    </ThemeProvider>
  );
}
