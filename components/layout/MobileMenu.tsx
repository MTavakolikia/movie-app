"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { LuMenu } from "react-icons/lu";
import { NAV_LINKS, SECONDARY_LINKS, isNavLinkActive } from "@/lib/site";
import { transition } from "@/lib/animations";
import { cn } from "@/lib/cn";
import Modal from "@/components/ui/Modal";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  onArtwork?: boolean;
}

const LIST: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: transition(0.55) },
};

function MenuContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="page-px flex h-16 shrink-0 items-center sm:h-20">
        <Logo />
      </div>

      <nav aria-label="Mobile" className="page-px flex-1 pt-2 pb-8">
        <motion.ul variants={LIST} initial="hidden" animate="visible" className="flex flex-col">
          {NAV_LINKS.map((link, index) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <motion.li key={link.href} variants={ITEM}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-baseline gap-4 rounded-xl px-2 py-2.5 font-display text-[2.6rem] leading-none tracking-tight transition-colors duration-300 sm:text-[3rem]",
                    active ? "text-accent" : "text-ink",
                  )}
                >
                  <span className="font-sans text-xs font-semibold tracking-[0.2em] text-faint tabular" aria-hidden>
                    0{index + 1}
                  </span>
                  {link.label}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="page-px space-y-6 pb-10"
      >
        <ul className="flex flex-wrap gap-2">
          {SECONDARY_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line pt-6">
          <span className="text-sm text-muted">Appearance</span>
          <ThemeToggle />
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Lumina is an independent discovery experience powered by the TMDb API.
        </p>
      </motion.div>
    </div>
  );
}

/** Full-screen menu for phones and tablets, built on the accessible modal. */
export default function MobileMenu({ open, onOpenChange, pathname, onArtwork = false }: MobileMenuProps) {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      onOpenChange(false);
    }
  }, [pathname, onOpenChange]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => onOpenChange(true)}
        className={cn(
          "inline-flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden",
          onArtwork ? "text-white" : "text-ink",
        )}
      >
        <LuMenu className="size-6" aria-hidden />
      </button>

      <Modal
        open={open}
        onClose={close}
        label="Site menu"
        anim="menu"
        panelClassName="h-full w-full max-w-none rounded-none border-0 bg-canvas"
      >
        <div id="mobile-menu">{open && <MenuContent pathname={pathname} onNavigate={close} />}</div>
      </Modal>
    </>
  );
}
