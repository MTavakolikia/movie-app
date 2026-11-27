import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";

/* ============================================================
   Logo — a lens ring with a streak of light escaping the frame.
   The ring has a gap so the hover rotation is readable.
   ============================================================ */

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} — home`}
      className={cn(
        "group relative inline-flex items-center gap-2.5 rounded-full transition-colors duration-500 focus-visible:outline-none",
        className,
      )}
    >
      <svg viewBox="0 0 36 36" className="size-9 overflow-visible" aria-hidden focusable="false">
        <g className="origin-center transition-transform duration-700 ease-cinematic group-hover:rotate-180">
          <circle
            cx="18"
            cy="18"
            r="12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="64 14.54"
            strokeLinecap="round"
          />
        </g>
        <path d="M8.5 27.5 27.5 8.5" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.7rem] leading-none tracking-[-0.01em]">{SITE.name}</span>
    </Link>
  );
}
