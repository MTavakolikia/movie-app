"use client";

import { useEffect } from "react";
import { LuRefreshCw } from "react-icons/lu";
import Button from "@/components/ui/Button";

/* ============================================================
   Route error boundary — a snapped reel, not a stack trace.
   ============================================================ */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <section className="grain relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(232_185_84/0.09),transparent_65%)]"
      />
      <div className="relative flex max-w-lg flex-col items-center">
        <p className="eyebrow mb-4">Something went wrong</p>
        <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] text-ink sm:text-7xl">
          The reel snapped.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
          An unexpected error interrupted the screening. It is usually temporary — run it back and the show should go on.
        </p>
        <Button variant="primary" size="lg" className="mt-9" onClick={reset}>
          <LuRefreshCw className="size-4" aria-hidden />
          Run it back
        </Button>
        {error.digest && (
          <p className="mt-6 text-[11px] text-faint tabular">Reference: {error.digest}</p>
        )}
      </div>
    </section>
  );
}
