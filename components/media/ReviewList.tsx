"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { LuQuote } from "react-icons/lu";
import type { ReviewItem } from "@/types/tmdb";
import { cn } from "@/lib/cn";

function formatReviewDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.content.length > 460;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface/50 p-5 sm:p-6">
      <LuQuote className="absolute top-4 right-4 size-8 text-line-strong" aria-hidden />
      <header className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent-soft font-display text-lg text-accent" aria-hidden>
          {review.author.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{review.author}</p>
          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-faint">
            {formatReviewDate(review.createdAt)}
            {review.rating !== null && (
              <span className="inline-flex items-center gap-1 text-accent tabular">
                <FaStar className="size-2.5" aria-hidden />
                {review.rating.toFixed(1)}
              </span>
            )}
          </p>
        </div>
      </header>

      <p
        className={cn(
          "mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-muted",
          !expanded && long && "line-clamp-6",
        )}
      >
        {review.content}
      </p>

      <footer className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        {long ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="cursor-pointer text-xs font-semibold text-accent transition-colors hover:text-accent-strong"
          >
            {expanded ? "Show less" : "Read the full review"}
          </button>
        ) : (
          <span />
        )}
        {review.url && (
          <a
            href={review.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[11px] text-faint transition-colors hover:text-accent"
          >
            TMDb
            <FiExternalLink className="size-3" aria-hidden />
          </a>
        )}
      </footer>
    </article>
  );
}

export default function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews-heading" className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">From the audience</p>
          <h2 id="reviews-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Reviews
            <span className="ml-2 font-sans text-sm font-medium text-faint tabular">({reviews.length})</span>
          </h2>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
