/* ============================================================
   Site identity — single source of truth for brand strings and
   the primary navigation model.
   ============================================================ */

export const SITE = {
  name: "Lumina",
  tagline: "Discover your next favourite story.",
  description:
    "Lumina is a cinematic guide to movies and TV shows — browse what's trending, dig into cast, trailers and reviews, and keep a watchlist of what to watch next.",
  author: "Mohammad Tavakolikia",
  url: "https://mtwebdev.ir",
} as const;

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/trending", label: "Trending" },
  { href: "/popular", label: "Popular" },
  { href: "/watchlist", label: "Watchlist" },
];

/** Secondary destinations surfaced in the footer and mobile menu. */
export const SECONDARY_LINKS: readonly NavLink[] = [
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export interface SocialLink {
  href: string;
  label: string;
  handle: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { href: "https://mtk-portfolio2.vercel.app/", label: "Portfolio", handle: "mtk-portfolio2.vercel.app" },
  { href: "https://instagram.com/mtwebdev.ir", label: "Instagram", handle: "@mtwebdev.ir" },
  { href: "https://t.me/mtwebdev_ir", label: "Telegram", handle: "@mtwebdev_ir" },
  { href: "mailto:mtwebdev66@gmail.com", label: "Email", handle: "mtwebdev66@gmail.com" },
  { href: "tel:+989128048579", label: "Phone", handle: "+98 912 804 85 79" },
];

/** Routes that render artwork under the navigation. */
const OVERLAY_ROUTES: readonly RegExp[] = [/^\/$/, /^\/(movies|tv)\/\d+$/, /^\/person\/\d+$/];

export function hasHeroBackdrop(pathname: string): boolean {
  return OVERLAY_ROUTES.some((pattern) => pattern.test(pathname));
}

/** "/movies/123" keeps "Movies" active; "/" only matches itself. */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
