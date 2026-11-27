import { cn } from "@/lib/cn";

/* ============================================================
   Skeletons — shaped exactly like the content they stand in
   for, so nothing shifts when data arrives.
   ============================================================ */

const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/** Poster-shaped placeholder matching MediaCard proportions. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)} aria-hidden>
      <div className="skeleton aspect-[2/3] w-full rounded-xl" />
      <div className="skeleton mt-3 h-4 w-3/4 rounded-md" />
      <div className="skeleton mt-2 h-3 w-1/2 rounded-md" />
    </div>
  );
}

export function CardGridSkeleton({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(GRID, className)} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Horizontal strip of poster skeletons for rails. */
export function CardRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} className="w-[38vw] shrink-0 sm:w-[170px] lg:w-[190px]" />
      ))}
    </div>
  );
}

/** Hero placeholder while the homepage loads. */
export function HeroSkeleton() {
  return (
    <div className="relative h-[92svh] max-h-[900px] min-h-[600px] overflow-hidden bg-surface" aria-hidden>
      <div className="skeleton absolute inset-0 rounded-none" />
      <div className="page-px absolute inset-x-0 bottom-0 pb-24">
        <div className="skeleton h-3.5 w-36 rounded-md" />
        <div className="skeleton mt-5 h-14 w-4/5 max-w-2xl rounded-xl sm:h-24" />
        <div className="skeleton mt-5 h-4 w-56 rounded-md" />
        <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-md" />
        <div className="skeleton mt-2.5 h-4 w-2/3 max-w-md rounded-md" />
        <div className="mt-8 flex gap-3">
          <div className="skeleton h-13 w-44 rounded-full" />
          <div className="skeleton h-13 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Header + grid placeholder for browse, search and watchlist routes. */
export function PageSkeleton({ withHero = false }: { withHero?: boolean }) {
  return (
    <div aria-hidden>
      {withHero && <HeroSkeleton />}
      <div className="page-px pt-28 pb-24 sm:pt-36">
        <div className="skeleton h-3.5 w-28 rounded-md" />
        <div className="skeleton mt-4 h-12 w-72 max-w-full rounded-xl sm:h-16 sm:w-96" />
        <div className="skeleton mt-4 h-4 w-full max-w-xl rounded-md" />
        <div className="mt-10 flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-9 w-24 rounded-full" />
          ))}
        </div>
        <CardGridSkeleton className="mt-10" />
      </div>
    </div>
  );
}

/** Backdrop + facts placeholder for the details pages. */
export function DetailsSkeleton() {
  return (
    <div aria-hidden>
      <div className="relative h-[86svh] min-h-[560px] overflow-hidden bg-surface">
        <div className="skeleton absolute inset-0 rounded-none" />
      </div>
      <div className="page-px relative -mt-40 pb-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
          <div className="skeleton aspect-[2/3] w-28 shrink-0 rounded-xl sm:w-56" />
          <div className="flex-1">
            <div className="skeleton h-4 w-48 rounded-md" />
            <div className="skeleton mt-4 h-14 w-3/4 rounded-xl sm:h-20" />
            <div className="skeleton mt-5 h-4 w-64 max-w-full rounded-md" />
            <div className="mt-8 flex gap-3">
              <div className="skeleton h-11 w-36 rounded-full" />
              <div className="skeleton h-11 w-36 rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="skeleton h-4 w-full rounded-md" />
            <div className="skeleton h-4 w-11/12 rounded-md" />
            <div className="skeleton h-4 w-4/5 rounded-md" />
            <div className="skeleton mt-8 h-40 w-full rounded-2xl" />
          </div>
          <div className="skeleton h-80 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
