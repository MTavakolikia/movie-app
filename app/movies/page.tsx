import type { Metadata } from "next";
import BrowseFilters from "@/components/browse/BrowseFilters";
import BrowseHeader from "@/components/browse/BrowseHeader";
import BrowseResults from "@/components/browse/BrowseResults";
import { movieGenres } from "@/constants/genres";
import { browseHref, parseBrowseFilters } from "@/lib/browse";
import { readPage, type AnySearchParams } from "@/lib/params";
import { discover } from "@/services/tmdb";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Films",
  description: "Browse every film in the catalogue — filter by genre, year, score, language and runtime.",
};

interface PageProps {
  searchParams: Promise<AnySearchParams>;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const { values, filters } = parseBrowseFilters("movie", params);
  const data = await discover("movie", filters, page);

  return (
    <div className="pb-24 sm:pb-32">
      <BrowseHeader
        eyebrow="The collection"
        title="Films"
        description="From first features to the established canon. Narrow the programme by mood, era, score or length — then give something unexpected a chance."
        meta={
          <span className="tabular">
            {data.unavailable ? "Signal lost" : `${data.totalResults.toLocaleString("en-US")} films`}
          </span>
        }
      />

      <div className="page-px">
        <BrowseFilters type="movie" genres={movieGenres} values={values} basePath="/movies" />
        <div className="mt-10">
          <BrowseResults
            data={data}
            basePath="/movies"
            values={values}
            emptyTitle="No films match this cut"
            emptyDescription="The catalogue is deep, but this combination is empty. Loosen a filter or reset the sort and try again."
          />
        </div>

        <p className="mt-14 text-center text-xs text-faint">
          Sorted by TMDb popularity by default.{" "}
          <a href={browseHref("/movies", values)} className="text-muted underline decoration-line-strong underline-offset-4 hover:text-accent">
            Permalink to this selection
          </a>
          .
        </p>
      </div>
    </div>
  );
}
