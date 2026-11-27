"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  /** Sit on hero artwork (light-on-dark) instead of the page surface. */
  onArtwork?: boolean;
  className?: string;
}

/** Sliding sun/moon switch. Dark is the primary experience. */
export default function ThemeToggle({ onArtwork = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-[68px] shrink-0 cursor-pointer items-center rounded-full border p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        onArtwork ? "border-white/20 bg-white/10" : "border-line-strong bg-surface-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 left-1 size-7 rounded-full bg-accent shadow-[0_4px_14px_rgb(232_185_84/0.45)]",
          mounted && "transition-transform duration-500 ease-cinematic",
          isDark ? "translate-x-[30px]" : "translate-x-0",
        )}
      />
      <FiSun
        aria-hidden
        className={cn(
          "absolute top-1/2 left-[11px] size-4 -translate-y-1/2 transition-colors duration-300",
          isDark ? "text-muted" : "text-on-accent",
        )}
      />
      <FiMoon
        aria-hidden
        className={cn(
          "absolute top-1/2 right-[11px] size-4 -translate-y-1/2 transition-colors duration-300",
          isDark ? "text-on-accent" : "text-muted",
        )}
      />
    </button>
  );
}
