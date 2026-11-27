import type { Metadata } from "next";
import BrowseHeader from "@/components/browse/BrowseHeader";
import WatchlistView from "@/components/watchlist/WatchlistView";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Everything you have saved for later — stored privately in your browser.",
};

export default function WatchlistPage() {
  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow="Your library"
        title="Watchlist"
        description="A private queue for the things you refuse to forget. Saved locally in this browser — no account, no email, no noise."
      />
      <div className="page-px">
        <WatchlistView />
      </div>
    </div>
  );
}
