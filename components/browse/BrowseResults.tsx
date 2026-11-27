import { LuFilm, LuSearchX } from "react-icons/lu";
import type { ListResult } from "@/services/tmdb";
import type { BrowseFilterState } from "@/lib/browse";
import { browseHref } from "@/lib/browse";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import MediaGrid from "@/components/media/MediaGrid";

interface BrowseResultsProps {
  data: ListResult;
  basePath: string;
  values: BrowseFilterState;
  showType?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Shared results block for every discover-backed browse route. */
export default function BrowseResults({
  data,
  basePath,
  values,
  showType = false,
  emptyTitle = "No titles match this cut",
  emptyDescription = "Try loosening a filter or two — the collection is deeper than it looks.",
}: BrowseResultsProps) {
  if (data.unavailable) {
    return (
      <div className="rounded-2xl border border-line bg-surface/40">
        <ServiceUnavailable title="The projector lost the signal" message="We couldn't reach the movie database for this request. Try again in a moment — your filters will be kept." />
      </div>
    );
  }

  if (data.results.length === 0) {
    return (
      <EmptyState
        icon={<LuSearchX aria-hidden />}
        title={emptyTitle}
        description={emptyDescription}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={basePath} variant="primary">
              Clear filters
            </Button>
            <Button href="/trending" variant="outline">
              <LuFilm aria-hidden /> See what&apos;s trending
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <>
      <MediaGrid items={data.results} showType={showType} />
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        hrefFor={(page) => browseHref(basePath, values, page)}
      />
    </>
  );
}
