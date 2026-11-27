import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import Reveal from "@/components/ui/Reveal";

/* ============================================================
   Interlude — a breath between rails. One idea, lots of air.
   ============================================================ */

export default function Interlude() {
  return (
    <Reveal className="my-10 sm:my-16">
      <section className="page-px">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-[radial-gradient(110%_160%_at_15%_0%,var(--accent-soft),transparent_58%)] px-7 py-14 sm:px-14 sm:py-20">
          <div aria-hidden className="grain absolute inset-0" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
            <blockquote>
              <p className="eyebrow mb-6">A note from the projection booth</p>
              <p className="font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.02] tracking-[-0.02em] text-ink text-balance">
                “Cinema is a matter of what&apos;s in the frame and what&apos;s out.”
              </p>
              <footer className="mt-6 text-sm text-muted">
                Martin Scorsese
              </footer>
            </blockquote>

            <div className="lg:pb-2">
              <p className="text-sm leading-relaxed text-muted">
                Lumina keeps the frame uncluttered. No noise, no infinite feed — just the films and series worth
                giving your evening to, arranged like a programme rather than a catalogue.
              </p>
              <Link
                href="/movies?sort=vote_average.desc&rating=8"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
              >
                Browse the canon
                <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
