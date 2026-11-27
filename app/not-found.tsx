import Link from "next/link";
import { LuArrowRight, LuClapperboard } from "react-icons/lu";

/* ============================================================
   404 — this scene never made the final cut.
   ============================================================ */

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgb(232_185_84/0.09),transparent_65%)]"
      />
      <div className="relative flex max-w-lg flex-col items-center">
        <span className="mb-7 grid size-16 place-items-center rounded-full border border-line bg-surface text-accent">
          <LuClapperboard className="size-7" aria-hidden />
        </span>
        <p className="eyebrow mb-4">404 — missing reel</p>
        <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] text-ink sm:text-7xl">
          This scene never made the final cut.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
          The page you are after was cut, renamed or only existed in the director&apos;s version. The rest of the
          programme is still running.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent shadow-[0_14px_34px_-14px_rgb(232_185_84/0.6)] transition-[background-color,scale] duration-300 ease-cinematic hover:bg-accent-strong active:scale-[0.97]"
          >
            Back to the feature
          </Link>
          <Link
            href="/search"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
          >
            Search the catalogue
            <LuArrowRight className="size-4 transition-transform duration-300 ease-cinematic group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
