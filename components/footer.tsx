import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Logo from "@/components/layout/Logo";
import Button from "@/components/ui/Button";
import { NAV_LINKS, SECONDARY_LINKS, SITE, SOCIAL_LINKS } from "@/lib/site";

/* ============================================================
   Footer — an editorial sign-off rather than a link dump.
   ============================================================ */

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-elevated">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
      />

      <div className="page-px relative py-16 sm:py-20">
        <div className="flex flex-col gap-8 border-b border-line pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">The next frame</p>
            <h2 className="font-display text-[2.4rem] leading-[0.98] tracking-[-0.02em] text-ink sm:text-[3.4rem]">
              There is always another story waiting.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/search" variant="primary" size="lg">
              Find a film
            </Button>
            <Button href="/trending" variant="outline" size="lg">
              What&apos;s trending
            </Button>
          </div>
        </div>

        <div className="grid gap-12 pt-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline} A cinematic guide to movies and series, built around the art of the poster and the pull of a good trailer.</p>
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-faint">
              This product uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
          </div>

          <nav aria-label="Explore">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-faint uppercase">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors duration-300 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Your library">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-faint uppercase">Library</h3>
            <ul className="space-y-2.5 text-sm">
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors duration-300 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.18em] text-faint uppercase">Elsewhere</h3>
            <ul className="space-y-2.5 text-sm">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="group inline-flex items-center gap-1.5 text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {link.label}
                    <FiArrowUpRight className="size-3.5 opacity-40 transition-[opacity,translate] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Designed and built by {SITE.author}.
          </p>
          <p className="sm:text-right">Press <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[0.65rem] text-muted">Tab</kbd> — everything is reachable without a mouse.</p>
        </div>
      </div>
    </footer>
  );
}
