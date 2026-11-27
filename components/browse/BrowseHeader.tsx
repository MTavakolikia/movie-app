import { cn } from "@/lib/cn";

interface BrowseHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Editorial page opener used by every browse route. */
export default function BrowseHeader({ eyebrow, title, description, meta, children, className }: BrowseHeaderProps) {
  return (
    <header className={cn("relative overflow-hidden pb-8 pt-28 sm:pt-36", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[620px] rounded-full bg-accent-soft blur-3xl"
      />
      <div className="page-px relative">
        <p className="eyebrow mb-4 flex items-center gap-2.5">
          <span className="inline-block h-px w-7 bg-accent" aria-hidden />
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(2.9rem,6vw,5.2rem)] leading-[0.92] tracking-[-0.025em] text-ink text-balance">
              {title}
            </h1>
            {description && <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">{description}</p>}
          </div>
          {meta && <div className="flex items-center gap-3 text-sm text-muted">{meta}</div>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
