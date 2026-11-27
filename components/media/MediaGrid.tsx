import type { MediaItem } from "@/types/tmdb";
import { cn } from "@/lib/cn";
import Reveal from "@/components/ui/Reveal";
import MediaCard from "./MediaCard";

interface MediaGridProps {
  items: MediaItem[];
  /** Tag TV shows — for mixed results. */
  showType?: boolean;
  columns?: string;
  className?: string;
}

/** Responsive poster grid with a staggered scroll-in reveal. */
export default function MediaGrid({ items, showType = false, columns, className }: MediaGridProps) {
  return (
    <Reveal className={className}>
      <div
        className={cn(
          "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
          columns,
        )}
      >
        {items.map((item, index) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} index={index} showType={showType} />
        ))}
      </div>
    </Reveal>
  );
}
