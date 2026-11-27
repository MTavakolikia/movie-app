import { cn } from "@/lib/cn";

/* ============================================================
   EmptyState — for empty results, empty watchlists, offline data
   ============================================================ */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-20 text-center sm:py-28", className)}>
      {icon && (
        <div className="mb-6 grid size-20 place-items-center rounded-full border border-line bg-surface text-3xl text-accent shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)]">
          {icon}
        </div>
      )}
      <h3 className="font-display text-2xl text-ink sm:text-3xl">{title}</h3>
      {description && <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
