"use client";

import { useRef, useState, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, FreeMode, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { cn } from "@/lib/cn";

/* ============================================================
   Carousel — horizontal free-scroll rail.
   Touch users drag, keyboard users get arrow keys (Swiper), and
   the paging controls advance by one viewport of items.
   ============================================================ */

export interface CarouselNavigation {
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
}

interface CarouselProps<T> {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Width classes for each slide (use the `!` suffix to beat Swiper's base width). */
  slideClassName: string;
  ariaLabel: string;
  /** Rendered in the page gutter above the rail; receives paging controls. */
  navigation?: (nav: CarouselNavigation) => ReactNode;
  className?: string;
}

/** Index to jump to when paging — one visible-width step, overlapping a card. */
function targetIndex(swiper: SwiperClass, direction: 1 | -1): number | null {
  const count = swiper.slides.length;
  if (count === 0) return null;
  const grid = swiper.slidesGrid;
  const slideWidth =
    count > 1 && grid[1] !== undefined && grid[0] !== undefined
      ? grid[1] - grid[0]
      : (swiper.slides[0]?.clientWidth ?? 0);
  if (!slideWidth) return null;

  const paddingLeft = parseFloat(getComputedStyle(swiper.el).paddingLeft) || 0;
  const visible = Math.max(1, Math.floor((swiper.width - paddingLeft) / slideWidth));
  const scrolled = -swiper.translate;

  let first = 0;
  for (let index = 0; index < count; index += 1) {
    const offset = grid[index];
    if (offset === undefined) break;
    if (offset <= scrolled + 1) first = index;
    else break;
  }

  return direction === 1 ? Math.min(first + visible - 1, count - 1) : Math.max(first - visible + 1, 0);
}

export default function Carousel<T>({ items, renderItem, slideClassName, ariaLabel, navigation, className }: CarouselProps<T>) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [bounds, setBounds] = useState({ canPrev: false, canNext: true });

  const sync = (swiper: SwiperClass) => {
    const canPrev = !swiper.isBeginning && swiper.progress > 0.001;
    const canNext = !swiper.isEnd && swiper.progress < 0.999;
    setBounds((previous) =>
      previous.canPrev === canPrev && previous.canNext === canNext ? previous : { canPrev, canNext },
    );
  };

  const page = (direction: 1 | -1) => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const target = targetIndex(swiper, direction);
    if (target !== null) swiper.slideTo(target, 550);
  };

  return (
    <div className={cn("relative", className)}>
      {navigation && <div className="page-px">{navigation({ ...bounds, prev: () => page(-1), next: () => page(1) })}</div>}
      <Swiper
        modules={[FreeMode, A11y, Keyboard]}
        freeMode={{ enabled: true }}
        slidesPerView="auto"
        spaceBetween={16}
        grabCursor
        keyboard={{ enabled: true, onlyInViewport: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          sync(swiper);
        }}
        onProgress={sync}
        onSlideChange={sync}
        onReachBeginning={sync}
        onReachEnd={sync}
        onResize={sync}
        onAfterInit={sync}
        className="rail-pl rail-mask"
        role="region"
        aria-label={ariaLabel}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className={slideClassName}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
