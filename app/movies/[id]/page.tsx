import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import DetailsView from "@/components/media/DetailsView";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";
import Button from "@/components/ui/Button";
import { getDetails } from "@/services/tmdb";
import { tmdbImage } from "@/lib/utils";

export const revalidate = 3600;

const loadDetails = cache((id: string) => getDetails("movie", id));

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await loadDetails(id);
  if (result.status !== "ok") return { title: "Film not found" };

  const { details } = result;
  const description = details.overview?.slice(0, 180) ?? details.tagline ?? `Details for ${details.title} on Lumina.`;
  const image = tmdbImage(details.backdropPath, "w1280");

  return {
    title: details.title,
    description,
    openGraph: {
      type: "video.movie",
      title: details.title,
      description,
      ...(image ? { images: [{ url: image, alt: `Backdrop from ${details.title}` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: details.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const result = await loadDetails(id);

  if (result.status === "not-found") notFound();

  if (result.status === "unavailable") {
    return (
      <div className="page-px pt-32 pb-24">
        <div className="rounded-2xl border border-line bg-surface/40">
          <ServiceUnavailable
            title="This feature didn't load"
            message="We couldn't reach the movie database for this title. Try again in a moment — the page will rebuild itself."
          />
        </div>
        <div className="mt-8 text-center">
          <Button href="/movies" variant="outline">
            Back to all films
          </Button>
        </div>
      </div>
    );
  }

  return <DetailsView details={result.details} />;
}
