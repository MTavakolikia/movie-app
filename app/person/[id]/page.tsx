import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { FiExternalLink } from "react-icons/fi";
import { LuChevronLeft, LuCake } from "react-icons/lu";
import ExpandableText from "@/components/ui/ExpandableText";
import MediaGrid from "@/components/media/MediaGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import { getPerson } from "@/services/tmdb";
import { tmdbImage } from "@/lib/utils";

export const revalidate = 3600;

const loadPerson = cache((id: number) => getPerson(id));

interface PageProps {
  params: Promise<{ id: string }>;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) return { title: "Person not found" };
  const person = await loadPerson(numeric);
  if (!person) return { title: "Person unavailable" };

  const image = tmdbImage(person.profilePath, "w500");
  const description = person.biography?.replace(/\s+/g, " ").slice(0, 170) || `Films and series featuring ${person.name}.`;
  return {
    title: person.name,
    description,
    openGraph: {
      title: person.name,
      description,
      ...(image ? { images: [{ url: image, alt: person.name }] } : {}),
    },
  };
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) notFound();

  const person = await loadPerson(numeric);
  if (!person) {
    return (
      <div className="page-px pt-32 pb-24">
        <div className="rounded-2xl border border-line bg-surface/40">
          <ServiceUnavailable
            title="We couldn't open this profile"
            message="The person record is unavailable right now. Try again in a moment — or head back to the films."
          />
        </div>
      </div>
    );
  }

  const portrait = tmdbImage(person.profilePath, "w780");

  return (
    <article className="pb-24 sm:pb-32">
      <section className="relative overflow-hidden bg-[#05060a] pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(110%_100%_at_78%_0%,rgb(232_185_84/0.16),transparent_58%)]" />
        <div aria-hidden className="grain absolute inset-0" />

        <div className="page-px relative">
          <Link href="/movies" className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white">
            <LuChevronLeft className="size-3.5" aria-hidden />
            Back to the collection
          </Link>

          <div className="mt-8 grid gap-8 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-end lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <div className="relative w-32 shrink-0 overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_-24px_rgb(0_0_0/0.9)] sm:w-full">
              <div className="relative aspect-[2/3]">
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={`Portrait of ${person.name}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 128px, 220px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-linear-to-br from-surface-2 to-black font-display text-5xl text-accent" aria-hidden>
                    {initials(person.name)}
                  </span>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-2.5">
                <span className="inline-block h-px w-6 bg-accent" aria-hidden />
                {person.knownForDepartment ?? "Talent"}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.8rem,6.5vw,5.4rem)] leading-[0.92] tracking-[-0.025em] text-white text-balance">
                {person.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                {person.birthday && (
                  <span className="inline-flex items-center gap-1.5 tabular">
                    <LuCake className="size-3.5 text-accent" aria-hidden />
                    {new Date(`${person.birthday}T00:00:00Z`).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                )}
                {person.placeOfBirth && (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-white/25" />
                    <span>{person.placeOfBirth}</span>
                  </>
                )}
                <span aria-hidden className="size-1 rounded-full bg-white/25" />
                <a
                  href={`https://www.themoviedb.org/person/${person.id}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-white/60 transition-colors hover:text-accent"
                >
                  TMDb profile
                  <FiExternalLink className="size-3" aria-hidden />
                </a>
              </div>

              {person.biography && (
                <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-md">
                  <ExpandableText text={person.biography} lines={5} threshold={380} className="[&_p]:text-white/70" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="page-px pt-14">
        {person.knownFor.length > 0 ? (
          <>
            <SectionHeader
              eyebrow="Filmography"
              title={`Known for ${person.name}`}
              description="A selection of the work audiences know best, pulled from the TMDb combined credits."
              className="mb-8"
            />
            <MediaGrid items={person.knownFor} showType />
          </>
        ) : (
          <p className="text-sm text-muted">No notable credits are listed for this person yet.</p>
        )}
      </div>
    </article>
  );
}
