"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { LuBookmark } from "react-icons/lu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavSearch from "./NavSearch";
import ThemeToggle from "./ThemeToggle";
import { NAV_LINKS, hasHeroBackdrop, isNavLinkActive } from "@/lib/site";
import { SPRING_SOFT } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { useWatchlist } from "@/components/watchlist/WatchlistProvider";

/* ============================================================
   SiteHeader — transparent over artwork, frosted once you scroll.
   The active link is a shared layout element, so the indicator
   glides between destinations instead of blinking.
   ============================================================ */

const ICON_LINK =
  "relative inline-flex size-10 items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const overlay = hasHeroBackdrop(pathname);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, ready } = useWatchlist();

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 24;
    setScrolled((previous) => (previous === next ? previous : next));
  });

  const solid = !overlay || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-cinematic",
        solid
          ? "border-b border-line bg-canvas/82 shadow-[0_20px_50px_-40px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          : "border-b border-transparent bg-linear-to-b from-black/55 via-black/20 to-transparent",
      )}
    >
      <div className="page-px flex h-16 items-center gap-3 sm:h-20">
        <Logo className={cn("shrink-0", solid ? "text-ink" : "text-white")} />

        <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-full px-3 text-[13px] font-medium tracking-wide transition-colors duration-300 xl:px-4",
                      solid
                        ? active
                          ? "text-ink"
                          : "text-muted hover:text-ink"
                        : active
                          ? "text-white"
                          : "text-white/65 hover:text-white",
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={SPRING_SOFT}
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-accent xl:inset-x-4"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={cn("ml-auto flex items-center gap-0.5 sm:gap-1.5", solid ? "text-ink" : "text-white")}>
          <Link
            href="/watchlist"
            aria-label={
              ready && items.length > 0 ? `Watchlist, ${items.length} saved` : "Watchlist"
            }
            className={cn(ICON_LINK, "hover:text-accent")}
          >
            <LuBookmark className="size-[18px]" aria-hidden />
            {ready && items.length > 0 && (
              <span className="absolute top-1 right-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 font-sans text-[9px] font-bold leading-4 text-on-accent tabular">
                {items.length > 9 ? "9+" : items.length}
              </span>
            )}
          </Link>

          <NavSearch onArtwork={!solid} />

          <div className="hidden items-center sm:flex">
            <ThemeToggle onArtwork={!solid} />
          </div>

          <MobileMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            pathname={pathname}
            onArtwork={!solid}
          />
        </div>
      </div>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className={cn(
          "h-px origin-left bg-accent transition-opacity duration-500",
          solid ? "opacity-100" : "opacity-0",
        )}
      />
    </header>
  );
}
