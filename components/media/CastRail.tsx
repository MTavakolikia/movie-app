import Image from "next/image";
import Link from "next/link";
import type { CastMember } from "@/types/tmdb";
import { tmdbImage } from "@/lib/utils";
import { cn } from "@/lib/cn";

/* ============================================================
   Cast rail — a touch-friendly horizontal strip. No JS: CSS
   snap for phones, a focusable region for keyboard users.
   ============================================================ */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");
}

export default function CastRail({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <section aria-labelledby="cast-heading" className="mt-14">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">On screen</p>
          <h2 id="cast-heading" className="font-display text-2xl text-ink sm:text-3xl">
            Cast
          </h2>
        </div>
        <p className="hidden text-xs text-faint sm:block">Swipe to explore</p>
      </div>

      <div
        role="region"
        aria-label="Cast members"
        tabIndex={0}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        {cast.map((person) => {
          const profile = tmdbImage(person.profilePath, "w185");
          return (
            <Link
              key={person.id}
              href={`/person/${person.id}`}
              className="group w-[112px] shrink-0 snap-start focus-visible:outline-none sm:w-[128px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/[0.06] transition-[ring-color,translate] duration-500 ease-cinematic group-hover:-translate-y-1 group-hover:ring-accent/40 group-focus-visible:ring-2 group-focus-visible:ring-accent">
                {profile ? (
                  <Image
                    src={profile}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                  />
                ) : (
                  <span
                    className={cn(
                      "grid h-full w-full place-items-center bg-linear-to-br from-surface-2 to-canvas font-display text-2xl text-muted",
                    )}
                    aria-hidden
                  >
                    {initials(person.name)}
                  </span>
                )}
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <p className="mt-2.5 truncate text-xs font-semibold text-ink transition-colors duration-300 group-hover:text-accent">
                {person.name}
              </p>
              {person.character && <p className="mt-0.5 truncate text-[11px] text-faint">{person.character}</p>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
