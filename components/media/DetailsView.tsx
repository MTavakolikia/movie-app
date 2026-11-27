import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { LuChevronLeft, LuClapperboard } from "react-icons/lu";
import type { MediaDetails } from "@/types/tmdb";
import { languages } from "@/constants/languages";
import {
  formatCount,
  formatDate,
  formatMoney,
  formatRating,
  formatRuntime,
  joinNames,
  mediaTypeLabel,
  tmdbImage,
  year,
} from "@/lib/utils";
import CastRail from "./CastRail";
import DetailsActions from "./DetailsActions";
import GalleryModal from "./GalleryModal";
import MediaCarousel from "./MediaCarousel";
import ReviewList from "./ReviewList";
import RatingRing from "@/components/ui/RatingRing";

/* ============================================================
   DetailsView — an editorial feature page for one title.
   The hero is intentionally theme-independent (cinema is dark);
   the body switches back to the warm surface system.
   ============================================================ */

function languageName(code: string | null): string {
  if (!code) return "—";
  return languages.find((entry) => entry.code === code)?.name ?? code.toUpperCase();
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">{label}</dt>
      <dd className="text-right text-xs font-medium text-ink">{children}</dd>
    </div>
  );
}

export default function DetailsView({ details }: { details: MediaDetails }) {
  const isTv = details.mediaType === "tv";
  const backdrop = tmdbImage(details.backdropPath ?? details.posterPath, "original");
  const poster = tmdbImage(details.posterPath, "w500");
  const backHref = isTv ? "/tv" : "/movies";
  const backLabel = isTv ? "All series" : "All films";
  const genreHref = (genreId: number) => `${backHref}?genre=${genreId}`;

  const entry = {
    id: details.id,
    mediaType: details.mediaType,
    title: details.title,
    posterPath: details.posterPath,
    backdropPath: details.backdropPath,
    releaseDate: details.releaseDate,
    voteAverage: details.voteAverage,
  };

  const spoken = details.spokenLanguages.map((language) => language.englishName);

  return (
    <article>
      <section
        aria-labelledby="detail-title"
        className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-[#05060a] pt-24 pb-12 sm:min-h-[88svh]"
      >
        {backdrop ? (
          <Image
            src={backdrop}
            alt={`Backdrop from ${details.title}`}
            fill
            priority
            sizes="100vw"
            quality={78}
            className="object-cover object-[center_28%]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1b2030] to-[#05060a]" />
        )}

        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#05060a_1%,rgb(5_6_10/0.92)_20%,rgb(5_6_10/0.45)_55%,rgb(5_6_10/0.6)_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgb(5_6_10/0.9)_0%,rgb(5_6_10/0.4)_42%,transparent_78%)]" />
        <div aria-hidden className="grain absolute inset-0" />

        <div className="page-px relative">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-white/50">
            <Link href={backHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <LuChevronLeft className="size-3.5" aria-hidden />
              {backLabel}
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-white/70">{details.title}</span>
          </nav>

          <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
            {poster && (
              <div className="relative w-20 shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.95)] sm:w-40 lg:w-52">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={poster}
                    alt={`Poster for ${details.title}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 160px, 208px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="eyebrow flex items-center gap-2.5">
                <span className="inline-block h-px w-6 bg-accent" aria-hidden />
                {mediaTypeLabel(details.mediaType)}
                {details.status && <span className="text-white/40">· {details.status}</span>}
              </p>

              <h1
                id="detail-title"
                className="mt-3 max-w-4xl font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.92] tracking-[-0.025em] text-white text-balance"
              >
                {details.title}
              </h1>

              {details.tagline && (
                <p className="mt-4 max-w-2xl font-display text-lg leading-snug text-white/65 italic sm:text-xl">
                  “{details.tagline}”
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5 font-semibold text-white tabular">
                  <FaStar className="size-3.5 text-accent" aria-hidden />
                  {formatRating(details.voteAverage)}
                  <span className="font-normal text-white/45">/ 10</span>
                </span>
                <span aria-hidden className="size-1 rounded-full bg-white/25" />
                <span className="tabular">{year(details.releaseDate)}</span>
                <span aria-hidden className="size-1 rounded-full bg-white/25" />
                <span>
                  {isTv
                    ? details.numberOfSeasons
                      ? `${details.numberOfSeasons} ${details.numberOfSeasons === 1 ? "season" : "seasons"}`
                      : "Series"
                    : formatRuntime(details.runtime)}
                </span>
                {details.voteCount > 0 && (
                  <>
                    <span aria-hidden className="size-1 rounded-full bg-white/25" />
                    <span className="tabular">{formatCount(details.voteCount)} ratings</span>
                  </>
                )}
              </div>

              {details.genres.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Genres">
                  {details.genres.map((genre) => (
                    <li key={genre.id}>
                      <Link
                        href={genreHref(genre.id)}
                        className="inline-flex h-8 items-center rounded-full border border-white/20 px-3.5 text-[11px] font-medium tracking-wide text-white/75 transition-colors duration-300 hover:border-accent hover:text-accent"
                      >
                        {genre.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8">
                <DetailsActions
                  title={details.title}
                  trailerKey={details.trailerKey}
                  entry={entry}
                  homepage={details.homepage}
                  imdbId={details.imdbId}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-px pb-10 pt-12 sm:pt-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_336px] lg:gap-16">
          <div className="min-w-0">
            <section aria-labelledby="story-heading">
              <p className="eyebrow mb-3">The story</p>
              <h2 id="story-heading" className="sr-only">
                Synopsis
              </h2>
              <p className="max-w-2xl text-base leading-[1.8] text-ink/90 sm:text-[17px]">
                {details.overview || "No synopsis has been written for this title yet."}
              </p>
              {spoken.length > 0 && (
                <p className="mt-5 text-xs text-faint">
                  Presented in {joinNames(spoken)}.
                </p>
              )}
            </section>

            <CastRail cast={details.cast} />
            <GalleryModal images={details.backdrops} title={details.title} />
            <ReviewList reviews={details.reviews} />
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <section aria-labelledby="facts-heading" className="rounded-2xl border border-line bg-surface/50 p-6">
              <div className="flex items-center gap-4 border-b border-line pb-5">
                <RatingRing value={details.voteAverage} size={72} />
                <div>
                  <h2 id="facts-heading" className="text-sm font-semibold text-ink">
                    TMDb score
                  </h2>
                  <p className="mt-0.5 text-xs text-faint tabular">
                    {details.voteCount > 0 ? `${details.voteCount.toLocaleString("en-US")} ratings` : "No ratings yet"}
                  </p>
                </div>
              </div>

              <dl className="mt-3 divide-y divide-line">
                <Fact label="Status">{details.status ?? "—"}</Fact>
                <Fact label={isTv ? "First aired" : "Released"}>{formatDate(details.releaseDate)}</Fact>
                {isTv ? (
                  <>
                    <Fact label="Seasons">{details.numberOfSeasons ?? "—"}</Fact>
                    <Fact label="Episodes">{details.numberOfEpisodes ?? "—"}</Fact>
                  </>
                ) : (
                  <Fact label="Runtime">{formatRuntime(details.runtime)}</Fact>
                )}
                <Fact label="Language">{languageName(details.originalLanguage)}</Fact>
                {!isTv && details.budget ? <Fact label="Budget">{formatMoney(details.budget)}</Fact> : null}
                {!isTv && details.revenue ? <Fact label="Revenue">{formatMoney(details.revenue)}</Fact> : null}
                {isTv && details.createdBy.length > 0 ? (
                  <Fact label="Created by">
                    {details.createdBy.map((person, index) => (
                      <span key={person.id}>
                        {index > 0 && ", "}
                        <Link href={`/person/${person.id}`} className="transition-colors hover:text-accent">
                          {person.name}
                        </Link>
                      </span>
                    ))}
                  </Fact>
                ) : null}
              </dl>
            </section>

            {details.productionCompanies.length > 0 && (
              <section aria-labelledby="production-heading" className="rounded-2xl border border-line bg-surface/50 p-6">
                <h2 id="production-heading" className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-faint uppercase">
                  <LuClapperboard className="size-3.5 text-accent" aria-hidden />
                  Production
                </h2>
                <ul className="mt-4 flex flex-wrap items-center gap-2">
                  {details.productionCompanies.map((company) => {
                    const logo = tmdbImage(company.logoPath, "w92");
                    return (
                      <li
                        key={company.id}
                        title={company.name}
                        className="flex h-9 min-w-0 items-center justify-center rounded-md bg-white/95 px-2"
                      >
                        {logo ? (
                          <Image
                            src={logo}
                            alt={company.name}
                            width={56}
                            height={22}
                            sizes="56px"
                            className="h-5 w-auto max-w-[72px] object-contain"
                          />
                        ) : (
                          <span className="max-w-[140px] truncate px-1 text-[10px] font-semibold text-[#1b1a17]">{company.name}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {details.crew.length > 0 && (
              <section aria-labelledby="crew-heading" className="rounded-2xl border border-line bg-surface/50 p-6">
                <h2 id="crew-heading" className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">
                  Key crew
                </h2>
                <ul className="mt-3 divide-y divide-line">
                  {details.crew.slice(0, 8).map((person) => (
                    <li key={`${person.id}-${person.job}`} className="flex items-baseline justify-between gap-3 py-2.5">
                      <Link href={`/person/${person.id}`} className="truncate text-xs font-medium text-ink transition-colors hover:text-accent">
                        {person.name}
                      </Link>
                      <span className="shrink-0 text-[10px] font-semibold tracking-[0.1em] text-faint uppercase">{person.job}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="px-1 text-[11px] leading-relaxed text-faint">
              Data and artwork from TMDb.{" "}
              <a
                href={`https://www.themoviedb.org/${details.mediaType}/${details.id}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-muted underline decoration-line-strong underline-offset-4 hover:text-accent"
              >
                View on TMDb
              </a>
              .
            </p>
          </aside>
        </div>
      </div>

      {details.similar.length > 0 && (
        <div className="border-t border-line pt-6">
          <MediaCarousel
            eyebrow="Keep the thread"
            title="If you liked this"
            description="Close neighbours in tone, era or ambition."
            items={details.similar}
            href={backHref}
            linkLabel={`More ${isTv ? "series" : "films"}`}
          />
        </div>
      )}

      {details.recommendations.length > 0 && (
        <div className="pb-10">
          <MediaCarousel
            eyebrow="Recommended next"
            title="The next queue"
            description="Pulled from what audiences with similar taste watch next."
            items={details.recommendations}
            href={backHref}
            linkLabel={`More ${isTv ? "series" : "films"}`}
          />
        </div>
      )}
    </article>
  );
}
