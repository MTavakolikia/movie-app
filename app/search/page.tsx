import type { Metadata } from "next";
import Link from "next/link";
import { LuFilm, LuSearchX, LuX } from "react-icons/lu";
import BrowseHeader from "@/components/browse/BrowseHeader";
import MediaGrid from "@/components/media/MediaGrid";
import SearchControls from "@/components/search/SearchControls";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import { genresFor } from "@/constants/genres";
import { languages } from "@/constants/languages";
import {
  activeFilterCount,
  hasAdvancedFilters,
  parseBrowseFilters,
  parseMediaType,
  searchHref,
  type BrowseFilterState,
} from "@/lib/browse";
import { readPage, readParam, type AnySearchParams } from "@/lib/params";
import { discover, getTrending, resolveKeywords, search, type ListResult } from "@/services/tmdb";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the catalogue by title, then refine by genre, year, score, language, runtime and release date.",
};

interface PageProps {
  searchParams: Promise<AnySearchParams>;
}

type Mode = "search" | "keywords" | "browse" | "trending";

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const type = parseMediaType(readParam(params, "type"));
  const query = readParam(params, "q").trim().slice(0, 80);
  const { values, filters } = parseBrowseFilters(type, params);
  const advanced = hasAdvancedFilters(values);

  let data: ListResult;
  let mode: Mode;
  let keywordFallback = false;

  if (query) {
    if (advanced) {
      const keywords = await resolveKeywords(query);
      if (keywords) {
        data = await discover(type, { ...filters, keywords }, page);
        mode = "keywords";
      } else {
        data = await search(query, type, page, values.year);
        mode = "search";
        keywordFallback = true;
      }
    } else {
      data = await search(query, type, page, values.year);
      mode = "search";
    }
  } else if (advanced) {
    data = await discover(type, filters, page);
    mode = "browse";
  } else {
    data = await getTrending(type, "week", page);
    mode = "trending";
  }

  const genreName = values.genre
    ? genresFor(type).find((genre) => String(genre.id) === values.genre)?.name
    : undefined;

  const chips: { key: keyof BrowseFilterState; value: string; label: string }[] = [];
  if (typeof genreName === "string") chips.push({ key: "genre", value: "", label: genreName });
  if (values.year) chips.push({ key: "year", value: "", label: values.year });
  if (values.rating) chips.push({ key: "rating", value: "", label: `${values.rating}.0+ score` });
  if (values.language) {
    const language = languages.find((entry) => entry.code === values.language)?.name ?? values.language.toUpperCase();
    chips.push({ key: "language", value: "", label: language });
  }
  if (values.runtime) {
    const labels: Record<string, string> = { short: "Under 90m", medium: "90–120m", long: "Over 2h" };
    chips.push({ key: "runtime", value: "", label: labels[values.runtime] ?? values.runtime });
  }
  if (values.sort !== "popularity.desc") chips.push({ key: "sort", value: "popularity.desc", label: "Custom sort" });

  const heading =
    mode === "search"
      ? `Results for “${query}”`
      : mode === "keywords"
        ? `Matches for “${query}”`
        : mode === "browse"
          ? "Filtered selection"
          : "Trending right now";

  const description =
    mode === "keywords"
      ? "TMDb keyword matches, narrowed by your filters. Remove the title to browse the whole filtered catalogue."
      : mode === "search" && keywordFallback
        ? "TMDb title search is ignoring genre, score, sort and runtime. Clear the title to apply those filters across the catalogue."
        : mode === "search"
          ? "Title matches from the catalogue. Refine with a genre, era or score, or clear the box to browse with filters."
          : mode === "browse"
            ? "Everything that matches your filters, ordered by your chosen sort."
            : "A good place to begin. Type above to search titles, or refine the selection with the filters.";

  const resetHref = searchHref(
    "",
    type,
    { ...values, genre: "", sort: "popularity.desc", year: "", rating: "", language: "", runtime: "" },
    1,
  );

  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow="Search & discovery"
        title="Find your next frame."
        description="Start with a title, or skip straight to the filters. Every selection lives in the URL, so the exact cut can be bookmarked, shared and revisited."
      />

      <div className="page-px">
        <SearchControls initialQuery={query} type={type} values={values} />

        <div className="mt-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="eyebrow mb-2">{mode === "trending" ? "Start here" : "Selection"}</p>
              <h2 className="font-display text-[1.9rem] leading-tight tracking-[-0.01em] text-ink sm:text-[2.4rem]">
                {heading}
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">{description}</p>
            </div>
            <p className="text-sm text-faint tabular">
              {data.unavailable ? "Signal lost" : `${data.totalResults.toLocaleString("en-US")} titles`}
            </p>
          </div>

          {(chips.length > 0 || query) && (
            <div className="mb-7 flex flex-wrap items-center gap-2">
              {query && (
                <Link
                  href={searchHref("", type, values)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-accent/50 bg-accent-soft px-3 text-xs font-semibold text-accent transition-colors hover:border-accent"
                >
                  “{query}”
                  <LuX className="size-3" aria-hidden />
                </Link>
              )}
              {chips.map((chip) => (
                <Link
                  key={chip.key}
                  href={searchHref(query, type, { ...values, [chip.key]: chip.value })}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  {chip.label}
                  <LuX className="size-3" aria-hidden />
                </Link>
              ))}
              {activeFilterCount(values) > 1 && (
                <Link href={resetHref} className="inline-flex h-8 items-center px-2 text-xs font-medium text-faint underline decoration-line-strong underline-offset-4 hover:text-accent">
                  Clear all filters
                </Link>
              )}
            </div>
          )}

          {data.unavailable ? (
            <div className="rounded-2xl border border-line bg-surface/40">
              <ServiceUnavailable
                title="The archive is unreachable"
                message="We couldn't reach TMDb for this search. Try again in a moment — the query and filters will stay in place."
              />
            </div>
          ) : data.results.length === 0 ? (
            <EmptyState
              icon={query ? <LuSearchX aria-hidden /> : <LuFilm aria-hidden />}
              title={query ? `Nothing found for “${query}”` : "No titles match this selection"}
              description={
                query
                  ? "Check the spelling, try a shorter title, or remove a filter to widen the search."
                  : "Try a different genre, era or score — or reset the filters and start again."
              }
              action={
                <Button href={searchHref("", type, { genre: "", sort: "popularity.desc", year: "", rating: "", language: "", runtime: "" })} variant="primary">
                  Reset the search
                </Button>
              }
            />
          ) : (
            <>
              <MediaGrid items={data.results} showType={mode === "trending"} />
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                hrefFor={(target) => searchHref(query, type, values, target)}
              />
            </>
          )}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-faint">
          <p>
            Tip: press <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[0.65rem] text-muted">/</kbd> anywhere to jump back to the search field.
          </p>
          <p className="inline-flex items-center gap-2">
            Powered by the TMDb discover API.
          </p>
        </div>
      </div>
    </div>
  );
}
