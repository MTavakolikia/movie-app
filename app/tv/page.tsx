import type { Metadata } from "next";
import BrowseFilters from "@/components/browse/BrowseFilters";
import BrowseHeader from "@/components/browse/BrowseHeader";
import BrowseResults from "@/components/browse/BrowseResults";
import { tvGenres } from "@/constants/genres";
import { parseBrowseFilters } from "@/lib/browse";
import { readPage, type AnySearchParams } from "@/lib/params";
import { discover } from "@/services/tmdb";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "TV Shows",
  description: "Browse series by genre, year, score and language — from limited runs to long-form commitments.",
};

interface PageProps {
  searchParams: Promise<AnySearchParams>;
}

export default async function TvPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const { values, filters } = parseBrowseFilters("tv", params);
  const data = await discover("tv", filters, page);

  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow="The small screen"
        title="Series"
        description="Long-form stories that earn their running time. Filter by genre, era, score or original language — the right series usually finds you at the right moment."
        meta={
          <span className="tabular">
            {data.unavailable ? "Signal lost" : `${data.totalResults.toLocaleString("en-US")} series`}
          </span>
        }
      />

      <div className="page-px">
        <BrowseFilters type="tv" genres={tvGenres} values={values} basePath="/tv" />
        <div className="mt-10">
          <BrowseResults
            data={data}
            basePath="/tv"
            values={values}
            emptyTitle="No series match this cut"
            emptyDescription="This combination of filters comes back empty. Try a wider era, a different genre, or reset the selection."
          />
        </div>
      </div>
    </div>
  );
}
