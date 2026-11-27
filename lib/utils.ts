/* ============================================================
   Shared helpers — TMDb artwork, formatting, labels
   ============================================================ */

export type ImageSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original";

/**
 * Image host override — must be NEXT_PUBLIC so server and client render
 * identical URLs. Useful for blocked networks or image mirrors; defaults
 * to TMDb when unset.
 */
const IMG = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE?.replace(/\/+$/, "") || "https://image.tmdb.org/t/p";

/** Builds a TMDb image URL, or null when there is no artwork. */
export function tmdbImage(path: string | null | undefined, size: ImageSize = "w500"): string | null {
  return path ? `${IMG}/${size}${path}` : null;
}

export const FALLBACK_POSTER = "/default-image.png";

/** 2019-04-24 -> "2019" */
export function year(date: string | null | undefined): string {
  return date ? date.slice(0, 4) : "—";
}

/** 2019-04-24 -> "24 Apr 2019" (UTC, so the date never shifts by timezone) */
export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

/** 142 -> "2h 22m" */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

/** 12345678 -> "$12.3M" */
export function formatMoney(amount: number | null | undefined): string {
  if (!amount || amount <= 0) return "—";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString("en-US")}`;
}

/** 7.843 -> "7.8" */
export function formatRating(value: number | null | undefined): string {
  return value ? value.toFixed(1) : "—";
}

/** 12345 -> "12.3K" */
export function formatCount(value: number | null | undefined): string {
  if (!value) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}

export function detailHref(mediaType: "movie" | "tv", id: number): string {
  return `/${mediaType === "movie" ? "movies" : "tv"}/${id}`;
}

export function mediaTypeLabel(mediaType: "movie" | "tv"): string {
  return mediaType === "movie" ? "Movie" : "Series";
}

/** Join names with a readable separator: "A, B and C". */
export function joinNames(names: string[]): string {
  const list = names.filter(Boolean);
  if (list.length <= 1) return list[0] ?? "";
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}
