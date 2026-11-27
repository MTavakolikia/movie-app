import type { Transition, Variants } from "motion/react";

/* ============================================================
   Lumina motion system — one consistent animation language.
   Springs for interactions, eased transforms for entrances.
   ============================================================ */

/** Signature ease — fast start, long cinematic settle. */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

export const SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 24 } as const;

export const DURATION = {
  fast: 0.28,
  base: 0.55,
  slow: 0.85,
} as const;

export const transition = (duration: number = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_CINEMATIC,
});

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition(DURATION.base) },
};

export const fadeUp = (distance = 28): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: { opacity: 1, y: 0, transition: transition(DURATION.base) },
});

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition(DURATION.base) },
};

/** Parent container — children declare fadeUp/fadeIn and are staggered. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Hero title words/lines entrance. */
export const heroLine: Variants = {
  hidden: { opacity: 0, y: 42, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_CINEMATIC },
  },
};

export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;
