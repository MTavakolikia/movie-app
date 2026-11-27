"use client";

import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import type { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/cn";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import MediaCard from "./MediaCard";

interface MediaCarouselProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  items: MediaItem[];
  /** Tag TV shows — for mixed collections. */
  showType?: boolean;
  /** Show 1..n rank badges (top-ten rails). */
  ranked?: boolean;
  /** Eager-load the first few posters (use only for above-the-fold rails). */
  priority?: boolean;
  className?: string;
}

const SLIDE = "w-[38vw]! sm:w-[168px]! lg:w-[186px]! xl:w-[200px]!";

const ARROW =
  "hidden size-10 cursor-pointer items-center justify-center rounded-full border border-line-strong text-ink transition-[border-color,color,scale,opacity] duration-300 hover:border-accent hover:text-accent active:scale-90 disabled:pointer-events-none disabled:opacity-30 md:inline-flex";

/** A discovery row: editorial heading + full-bleed, free-scrolling poster rail. */
export default function MediaCarousel({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  items,
  showType = false,
  ranked = false,
  priority = false,
  className,
}: MediaCarouselProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn("py-6 sm:py-8", className)} aria-label={title}>
      <Reveal>
        <Carousel
          items={items}
          ariaLabel={`${title} — scrollable list`}
          slideClassName={SLIDE}
          navigation={({ canPrev, canNext, prev, next }) => (
            <SectionHeader
              className="mb-5"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              linkLabel={linkLabel}
              actions={
                <>
                  <button type="button" className={ARROW} onClick={prev} disabled={!canPrev} aria-label={`Scroll ${title} backwards`}>
                    <LuArrowLeft className="size-4" aria-hidden />
                  </button>
                  <button type="button" className={ARROW} onClick={next} disabled={!canNext} aria-label={`Scroll ${title} forwards`}>
                    <LuArrowRight className="size-4" aria-hidden />
                  </button>
                </>
              }
            />
          )}
          renderItem={(item, index) => (
            <MediaCard
              item={item}
              index={index}
              showType={showType}
              rank={ranked ? index + 1 : undefined}
              priority={priority && index < 5}
            />
          )}
        />
      </Reveal>
    </section>
  );
}
