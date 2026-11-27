"use client";

import { motion, useReducedMotion } from "motion/react";
import { LuBookmark } from "react-icons/lu";
import { SPRING } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { useWatchlist, type WatchlistEntry } from "./WatchlistProvider";

interface WatchlistButtonProps {
  entry: Omit<WatchlistEntry, "addedAt">;
  variant?: "icon" | "label";
  /** "artwork" sits on a poster/backdrop; "surface" sits on page background. */
  tone?: "artwork" | "surface";
  /**
   * Keep the icon out of sight until the card is hovered or focused on
   * fine-pointer devices. Touch devices and keyboard users always get it.
   */
  revealOnHover?: boolean;
  className?: string;
}

/** Animated bookmark toggle with aria-pressed semantics. */
export default function WatchlistButton({
  entry,
  variant = "icon",
  tone = "artwork",
  revealOnHover = false,
  className,
}: WatchlistButtonProps) {
  const { has, toggle } = useWatchlist();
  const reduceMotion = useReducedMotion();
  const active = has(entry.id, entry.mediaType);
  const label = active ? `Remove ${entry.title} from watchlist` : `Add ${entry.title} to watchlist`;
  const concealed = revealOnHover && !active;

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(entry);
      }}
      whileTap={reduceMotion ? undefined : { scale: 0.84 }}
      transition={SPRING}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border backdrop-blur-md transition-[opacity,background-color,border-color,color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        variant === "icon" ? "size-9" : "h-11 px-5 text-sm font-semibold",
        active
          ? "border-accent bg-accent text-on-accent"
          : tone === "surface"
            ? "border-line-strong bg-surface-2 text-ink hover:border-accent hover:text-accent"
            : "border-white/25 bg-black/55 text-white hover:border-accent hover:text-accent",
        concealed && "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100 focus-visible:opacity-100",
        className,
      )}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={reduceMotion ? false : { scale: 0.3, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={SPRING}
        className="inline-flex"
        aria-hidden
      >
        <LuBookmark className={cn("size-4", active && "fill-current")} />
      </motion.span>
      {variant === "label" && <span>{active ? "In watchlist" : "Watchlist"}</span>}
    </motion.button>
  );
}
