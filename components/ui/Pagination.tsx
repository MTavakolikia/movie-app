import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds an href for a given page — lets routes keep their own param scheme. */
  hrefFor: (page: number) => string;
}

function pageWindow(current: number, total: number): number[] {
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  if (current <= 2) [3, 4].forEach((p) => pages.add(p));
  if (current >= total - 1) [total - 2, total - 3].forEach((p) => pages.add(p));
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

/** Link-based pagination — keeps browsing fully server-rendered. */
export default function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent",
          page === 1 && "pointer-events-none opacity-40",
        )}
      >
        <FaChevronLeft className="size-3.5" aria-hidden />
      </Link>

      {pages.map((p, index) => (
        <span key={p} className="inline-flex items-center gap-2">
          {index > 0 && p - pages[index - 1] > 1 && <span className="text-faint">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
              p === page
                ? "border-accent bg-accent text-on-accent"
                : "border-line text-muted hover:border-accent hover:text-accent",
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        aria-label="Next page"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent",
          page === totalPages && "pointer-events-none opacity-40",
        )}
      >
        <FaChevronRight className="size-3.5" aria-hidden />
      </Link>
    </nav>
  );
}
