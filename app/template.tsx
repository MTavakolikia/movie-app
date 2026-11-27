"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_CINEMATIC } from "@/lib/animations";

/* ============================================================
   Route transition — a template remounts on navigation, so this
   gives every page a short cinematic fade-and-rise without
   locking the whole layout. Exits are handled by the browser;
   the entrance keeps navigation feeling immediate.
   ============================================================ */

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE_CINEMATIC }}
    >
      {children}
    </motion.div>
  );
}
