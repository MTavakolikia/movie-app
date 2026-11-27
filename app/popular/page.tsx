import type { Metadata } from "next";
import BrowseFilters from "@/components/browse/BrowseFilters";
import BrowseHeader from "@/components/browse/BrowseHeader";
import BrowseResults from "@/components/browse/BrowseResults";
import MediaCarousel from "@/components/media/MediaCarousel";
import { movieGenres } from "@/constants/genres";
import { parseBrowseFilters } from "@/lib/browse";
import { readPage, type AnySearchParams } from "@/lib/params";
import { discover, getTvList } from "@/services/tmdb";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Popular",
  description: "The most-watched films and series right now, ranked by real audience attention on TMDb.",
};

interface PageProps {
  searchParams: Promise<AnySearchParams>;
}

export default async function PopularPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const { values, filters } = parseBrowseFilters("movie", params);
  const [data, popularSeries] = await Promise.all([discover("movie", filters, page), getTvList("popular")]);

  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow="The public vote"
        title="Popular now"
        description="What most people are actually pressing play on. Popularity is momentum, not merit — but it is a very good place to start on a Friday night."
        meta={
          <span className="tabular">
            {data.unavailable ? "Signal lost" : `${data.totalResults.toLocaleString("en-US")} films`}
          </span>
        }
      />

      <div className="page-px">
        <BrowseFilters type="movie" genres={movieGenres} values={values} basePath="/popular" />
        <div className="mt-10">
          <BrowseResults
            data={data}
            basePath="/popular"
            values={values}
            emptyTitle="No popular films match"
            emptyDescription="Popularity and filters can disagree. Reset the selection to see the current chart."
          />
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-10">
        <MediaCarousel
          eyebrow="Also surging"
          title="Series everyone is watching"
          description="The small-screen half of the conversation."
          href="/tv"
          items={popularSeries.results}
        />
      </div>
    </div>
  );
}
