import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  /** Extra controls placed after the "View all" link (rail arrows). */
  actions?: React.ReactNode;
  className?: string;
}

/** Editorial section heading with an optional "View all" affordance. */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="eyebrow mb-2 flex items-center gap-2.5">
            <span className="inline-block h-px w-6 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[1.7rem] leading-[1.05] tracking-[-0.01em] text-ink sm:text-[2.1rem]">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {(href || actions) && (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {href && (
            <Link
              href={href}
              className="group inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-xs font-semibold tracking-wide text-muted transition-[border-color,color] duration-300 hover:border-accent hover:text-accent"
            >
              {linkLabel}
              <LuArrowRight className="size-3.5 transition-transform duration-300 ease-cinematic group-hover:translate-x-0.5" aria-hidden />
            </Link>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}
