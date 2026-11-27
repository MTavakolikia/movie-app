import type { MediaItem } from "@/types/tmdb";
import SectionHeader from "@/components/ui/SectionHeader";
import MediaCarousel from "@/components/media/MediaCarousel";

interface MediaRowProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: MediaItem[];
  href?: string;
  linkLabel?: string;
}

/** Server-composed discovery row: heading + horizontal carousel. */
export default function MediaRow({ eyebrow, title, description, items, href, linkLabel = "View all" }: MediaRowProps) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 lg:px-10" aria-labelledby={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div id={`row-${title.replace(/\s+/g, "-").toLowerCase()}`}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} href={items.length >= 6 ? href : undefined} linkLabel={linkLabel} />
      </div>
      <MediaCarousel items={items} ariaLabel={`${title} collection`} />
    </section>
  );
}
