import type { Metadata } from "next";
import Link from "next/link";
import { LuCompass, LuFilm } from "react-icons/lu";
import BrowseHeader from "@/components/browse/BrowseHeader";
import MediaGrid from "@/components/media/MediaGrid";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import { readPage, readParam, type AnySearchParams } from "@/lib/params";
import { cn } from "@/lib/cn";
import { getTrending, type TrendingType, type TrendingWindow } from "@/services/tmdb";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Trending",
  description: "What the world is watching today and this week — films and series moving fastest on TMDb.",
};

interface PageProps {
  searchParams: Promise<AnySearchParams>;
}

const TYPES: { value: TrendingType; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "movie", label: "Films" },
  { value: "tv", label: "Series" },
];

const WINDOWS: { value: TrendingWindow; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This week" },
];

function trendingHref(type: TrendingType, window: TrendingWindow, page = 1): string {
  const params = new URLSearchParams();
  if (type !== "all") params.set("type", type);
  if (window !== "week") params.set("window", window);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/trending?${query}` : "/trending";
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const requestedType = readParam(params, "type");
  const requestedWindow = readParam(params, "window");
  const type: TrendingType = requestedType === "movie" || requestedType === "tv" ? requestedType : "all";
  const window: TrendingWindow = requestedWindow === "day" ? "day" : "week";
  const data = await getTrending(type, window, page);

  const title = type === "movie" ? "Films in motion" : type === "tv" ? "Series in motion" : "Trending now";
  const scope = window === "day" ? "in the last 24 hours" : "this week";

  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow={`Moving fastest ${scope}`}
        title={title}
        description="Not a ranking of quality — a temperature reading. These are the titles pulling the most attention right now, refreshed straight from TMDb."
        meta={
          <span className="tabular">
            {data.unavailable ? "Signal lost" : `${data.totalResults.toLocaleString("en-US")} titles`}
          </span>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Media type" className="inline-flex w-fit flex-wrap gap-1 rounded-full border border-line bg-surface/60 p-1">
            {TYPES.map((option) => {
              const active = option.value === type;
              return (
                <Link
                  key={option.value}
                  href={trendingHref(option.value, window)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-colors duration-300",
                    active ? "bg-accent text-on-accent" : "text-muted hover:text-ink",
                  )}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>

          <div role="group" aria-label="Time window" className="inline-flex w-fit gap-1 rounded-full border border-line p-1">
            {WINDOWS.map((option) => {
              const active = option.value === window;
              return (
                <Link
                  key={option.value}
                  href={trendingHref(type, option.value)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold transition-colors duration-300",
                    active ? "bg-surface-2 text-ink" : "text-faint hover:text-ink",
                  )}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      </BrowseHeader>

      <div className="page-px">
        {data.unavailable ? (
          <div className="rounded-2xl border border-line bg-surface/40">
            <ServiceUnavailable title="The feed went quiet" message="We couldn't reach the trending feed. Try again in a moment — the list will come back." />
          </div>
        ) : data.results.length === 0 ? (
          <EmptyState
            icon={<LuCompass aria-hidden />}
            title="Nothing is moving yet"
            description="This window is unusually quiet. Switch the time range or head into the full catalogue."
            action={
              <Button href="/movies" variant="primary">
                <LuFilm aria-hidden /> Browse films
              </Button>
            }
          />
        ) : (
          <>
            <MediaGrid items={data.results} showType={type === "all"} />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              hrefFor={(target) => trendingHref(type, window, target)}
            />
          </>
        )}
      </div>
    </div>
  );
}
