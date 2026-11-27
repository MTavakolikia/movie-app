import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Interlude from "@/components/home/Interlude";
import Spotlight from "@/components/home/Spotlight";
import MediaCarousel from "@/components/media/MediaCarousel";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import { genreNames } from "@/constants/genres";
import {
  getFeatured,
  getMovieList,
  getRecommendations,
  getTrending,
  getTvList,
} from "@/services/tmdb";
import type { FeaturedItem } from "@/types/tmdb";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Lumina — Discover your next favourite story",
  description:
    "A cinematic guide to what's trending, now playing and worth your evening — plus a watchlist that remembers.",
};

export default async function HomePage() {
  const [trending, popular, nowPlaying, upcoming, topRated, tvPopular] = await Promise.all([
    getTrending("all", "week"),
    getMovieList("popular"),
    getMovieList("now_playing"),
    getMovieList("upcoming"),
    getMovieList("top_rated"),
    getTvList("popular"),
  ]);

  const reachable = [trending, popular, nowPlaying, topRated, tvPopular].some(
    (result) => !result.unavailable,
  );

  const seed = (
    trending.results.filter((item) => item.backdropPath).length > 0
      ? trending.results.filter((item) => item.backdropPath)
      : popular.results
  ).slice(0, 5);

  const enriched = await Promise.all(seed.map((item) => getFeatured(item)));
  const heroItems: FeaturedItem[] = enriched.filter((entry): entry is FeaturedItem => entry !== null);

  const heroSlides =
    heroItems.length > 0
      ? heroItems
      : seed.map((item) => ({
          item,
          genres: genreNames(item.genreIds, 3),
          runtime: null,
          trailerKey: null,
        }));

  const recommendationSeed = heroSlides[0]?.item ?? popular.results[0] ?? topRated.results[0];
  const recommended = recommendationSeed
    ? await getRecommendations(recommendationSeed.mediaType, recommendationSeed.id)
    : [];

  const trendingItems = trending.results.filter((item) => item.mediaType === "movie" || item.mediaType === "tv");

  return (
    <div className="pb-16 sm:pb-24">
      {heroSlides.length > 0 ? <Hero items={heroSlides} /> : <ServiceUnavailable asHero />}

      <div id="discover" className="relative">
        <div className="pt-8 sm:pt-14">
          <MediaCarousel
            eyebrow="This week"
            title="Trending right now"
            description="The titles everyone is arguing about, watching twice, and adding to their lists."
            href="/trending"
            items={trendingItems}
            showType
            priority
          />
        </div>

        {popular.results[0] && <Spotlight item={popular.results[0]} />}

        <MediaCarousel
          eyebrow="In theatres"
          title="Now playing"
          description="Fresh from the big screen — the current cinema programme."
          href="/movies?sort=popularity.desc"
          items={nowPlaying.results}
        />

        <MediaCarousel
          eyebrow="The canon"
          title="Top rated of all time"
          description="A reminder of what the medium can do when everything aligns."
          href="/movies?sort=vote_average.desc&rating=8"
          items={topRated.results}
          ranked
        />

        <Interlude />

        <MediaCarousel
          eyebrow="On the horizon"
          title="Coming soon"
          description="Titles worth marking in the calendar before the trailers give everything away."
          href="/movies?sort=primary_release_date.desc"
          items={upcoming.results}
        />

        <MediaCarousel
          eyebrow="Long-form"
          title="Series worth the commitment"
          description="The shows that reward patience, episode after episode."
          href="/tv"
          items={tvPopular.results}
        />

        {recommended.length > 0 && (
          <MediaCarousel
            eyebrow="For you"
            title={recommendationSeed ? `More like ${recommendationSeed.title}` : "Recommended"}
            description="A thread pulled from the recommendation engine — follow it and see where it leads."
            href={recommendationSeed ? `/movies/${recommendationSeed.id}` : "/movies"}
            linkLabel="See the source"
            items={recommended}
          />
        )}

        {!reachable && (
          <div className="page-px">
            <ServiceUnavailable
              title="The reels are on hold"
              message="We couldn't reach the movie database just now. Everything below is a graceful pause, not the end of the feature — try again in a moment."
            />
          </div>
        )}
      </div>
    </div>
  );
}
