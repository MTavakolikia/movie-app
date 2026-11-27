"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { FaPlay, FaStar } from "react-icons/fa6";
import { LuArrowLeft, LuArrowRight, LuPause, LuPlay } from "react-icons/lu";
import type { FeaturedItem } from "@/types/tmdb";
import { EASE_CINEMATIC } from "@/lib/animations";
import { cn } from "@/lib/cn";
import {
  detailHref,
  formatCount,
  formatRating,
  formatRuntime,
  mediaTypeLabel,
  tmdbImage,
  year,
} from "@/lib/utils";
import Button from "@/components/ui/Button";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import TrailerModal, { type TrailerTarget } from "@/components/media/TrailerModal";

/* ============================================================
   Hero — the trailer moment. A full-bleed, slowly drifting
   backdrop, a staggered editorial title block and a rotating
   lineup of featured titles. Motion is scroll-aware and fully
   disarmed for reduced-motion visitors.
   ============================================================ */

const ROTATE_MS = 10_000;

const CONTAINER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.085, delayChildren: 0.12 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_CINEMATIC },
  },
};

const CONTROL =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white backdrop-blur-md transition-[background-color,border-color,scale] duration-300 hover:border-white/45 hover:bg-white/15 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function Hero({ items }: { items: FeaturedItem[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [trailer, setTrailer] = useState<TrailerTarget | null>(null);
  /** Only set by manual navigation, so autoplay never spams the live region. */
  const [announcement, setAnnouncement] = useState("");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const active = items[index] ?? items[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const imageY = useSpring(rawY, { stiffness: 120, damping: 30, mass: 0.5 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, 40]);

  const paused = hovered || userPaused || trailer !== null;

  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [paused, reduced, count, index]);

  if (!active) return null;

  const slide = active;
  const genres = slide.genres.slice(0, 3);
  const announceSlide = (slideIndex: number) => {
    const entry = items[slideIndex];
    if (!entry) return;
    setAnnouncement(
      `Featured: ${entry.item.title}, ${year(entry.item.releaseDate)}. Slide ${slideIndex + 1} of ${count}.`,
    );
  };
  const go = (direction: 1 | -1) => {
    const next = (index + direction + count) % count;
    setIndex(next);
    announceSlide(next);
  };

  return (
    <div ref={sectionRef} className="relative">
      <section
        aria-label="Featured films"
        aria-roledescription="carousel"
        className="relative h-[94svh] max-h-[1000px] min-h-[640px] overflow-hidden bg-[#05060a]"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(false);
        }}
      >
        {/* Artwork stack — every slide stays mounted so crossfades never wait on the network. */}
        <motion.div
          aria-hidden
          style={reduced ? undefined : { y: imageY }}
          className="absolute -inset-[6%]"
        >
          {items.map((entry, slideIndex) => {
            const source = tmdbImage(entry.item.backdropPath ?? entry.item.posterPath, "original");
            if (!source) return null;
            return (
              <motion.div
                key={`${entry.item.mediaType}-${entry.item.id}`}
                initial={false}
                animate={{ opacity: slideIndex === index ? 1 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={source}
                  alt=""
                  fill
                  sizes="100vw"
                  quality={72}
                  fetchPriority={slideIndex === 0 ? "high" : "low"}
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  className="object-cover object-[center_22%]"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Cinematic grading */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#0a0b0f_2%,rgb(10_11_15/0.86)_22%,rgb(10_11_15/0.25)_56%,rgb(5_6_10/0.55)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgb(5_6_10/0.92)_0%,rgb(5_6_10/0.55)_38%,transparent_72%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_18%,transparent_35%,rgb(5_6_10/0.55)_100%)]" />
        <div aria-hidden className="grain absolute inset-0" />

        {/* Content */}
        <motion.div
          style={reduced ? undefined : { opacity: contentOpacity, y: contentY }}
          className="page-px relative flex h-full flex-col justify-end pt-28 pb-7 sm:pb-10"
        >
          <div key={index} className="max-w-4xl">
            <motion.div variants={CONTAINER} initial={reduced ? "visible" : "hidden"} animate="visible">
              <motion.div variants={ITEM} className="flex flex-wrap items-center gap-3">
                <span className="eyebrow flex items-center gap-2.5 text-accent">
                  <span className="inline-block h-px w-7 bg-accent" aria-hidden />
                  Featured presentation
                </span>
                <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-white/45 tabular">
                  {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
              </motion.div>

              <motion.h1
                variants={ITEM}
                className="mt-4 max-w-4xl font-display text-[clamp(2.9rem,7.4vw,6.4rem)] leading-[0.92] tracking-[-0.025em] text-white text-balance"
              >
                {slide.item.title}
              </motion.h1>

              <motion.div variants={ITEM} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5 font-semibold text-white tabular">
                  <FaStar className="size-3.5 text-accent" aria-hidden />
                  {formatRating(slide.item.voteAverage)}
                  <span className="font-normal text-white/45">/ 10</span>
                </span>
                <span aria-hidden className="size-1 rounded-full bg-white/30" />
                <span className="tabular">{year(slide.item.releaseDate)}</span>
                {slide.item.voteCount > 0 && (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-white/30" />
                    <span className="tabular">{formatCount(slide.item.voteCount)} ratings</span>
                  </>
                )}
                {slide.runtime ? (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-white/30" />
                    <span>{formatRuntime(slide.runtime)}</span>
                  </>
                ) : null}
                <span aria-hidden className="size-1 rounded-full bg-white/30" />
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase">
                  {mediaTypeLabel(slide.item.mediaType)}
                </span>
              </motion.div>

              {genres.length > 0 && (
                <motion.p variants={ITEM} className="mt-3 text-xs font-medium tracking-[0.14em] text-white/45 uppercase">
                  {genres.join("  ·  ")}
                </motion.p>
              )}

              {slide.item.overview && (
                <motion.p variants={ITEM} className="mt-5 max-w-xl text-sm leading-relaxed text-white/72 sm:text-[15px]">
                  {slide.item.overview}
                </motion.p>
              )}

              <motion.div variants={ITEM} className="mt-8 flex flex-wrap items-center gap-3">
                {slide.trailerKey && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setTrailer({ key: slide.trailerKey as string, title: slide.item.title })}
                  >
                    <FaPlay className="size-3" aria-hidden />
                    Watch trailer
                  </Button>
                )}
                <Button href={detailHref(slide.item.mediaType, slide.item.id)} variant="glass" size="lg">
                  Explore details
                </Button>
                <WatchlistButton entry={slide.item} variant="label" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom rail: pause, paging, slide indicators */}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-5 sm:mt-12">
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase sm:inline-flex">
                <span className="inline-block h-px w-6 bg-white/30" aria-hidden />
                Scroll to explore
              </span>
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-label={userPaused ? "Resume featured rotation" : "Pause featured rotation"}
                className={cn(CONTROL, "size-9")}
              >
                {userPaused ? <LuPlay className="size-3.5" aria-hidden /> : <LuPause className="size-3.5" aria-hidden />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" role="group" aria-label="Choose a featured title">
                {items.map((entry, slideIndex) => {
                  const isActive = slideIndex === index;
                  return (
                    <button
                      key={`${entry.item.id}-dot`}
                      type="button"
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`${entry.item.title}`}
                      onClick={() => {
                        setIndex(slideIndex);
                        announceSlide(slideIndex);
                      }}
                      className={cn(
                        "group relative h-1 overflow-hidden rounded-full transition-[width,background-color] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                        isActive ? "w-9 bg-white/20" : "w-5 bg-white/20 hover:bg-white/40",
                      )}
                    >
                      {isActive && (
                        <span
                          key={index}
                          data-paused={paused || Boolean(reduced)}
                          className="hero-progress absolute inset-0 bg-accent"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => go(-1)} aria-label="Previous featured title" className={CONTROL}>
                  <LuArrowLeft className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next featured title" className={CONTROL}>
                  <LuArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Announced only when the visitor changes the slide themselves. */}
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </section>

      <TrailerModal trailer={trailer} onClose={() => setTrailer(null)} />

      <Link href="#discover" className="sr-only">
        Skip to discoveries
      </Link>
    </div>
  );
}
