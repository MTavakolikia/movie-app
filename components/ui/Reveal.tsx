"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/* ============================================================
   Reveal — scroll-triggered staggered entrance.

   This wrapper only observes; the animated children stay
   server-rendered and opt in with `data-reveal-item`. The CSS
   hides items only when JS is present (html.js), so content is
   never lost without scripts or with reduced motion.
   ============================================================ */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" data-reveal-state={inView ? "in" : "pending"} className={cn(className)}>
      {children}
    </div>
  );
}
