"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuUnplug } from "react-icons/lu";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/* ============================================================
   ServiceUnavailable — shown when TMDb could not be reached.
   Offers an in-place retry that re-renders the server component.
   ============================================================ */

interface ServiceUnavailableProps {
  title?: string;
  message?: string;
  /** Fill the viewport-height hero slot on the homepage. */
  asHero?: boolean;
  className?: string;
}

export default function ServiceUnavailable({ title, message, asHero = false, className }: ServiceUnavailableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        asHero
          ? "relative h-[92svh] max-h-[900px] min-h-[600px] overflow-hidden bg-surface pt-20 pb-28"
          : "py-24",
        className,
      )}
    >
      {asHero && <div aria-hidden className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(232_185_84/0.12),transparent_60%)]" />}
      <div className="relative flex max-w-xl flex-col items-center">
        <span className="mb-6 grid size-16 place-items-center rounded-full border border-line bg-canvas text-2xl text-accent">
          <LuUnplug aria-hidden />
        </span>
        <p className="eyebrow mb-3">Signal lost</p>
        <h1 className="font-display text-4xl leading-[1.02] text-ink sm:text-6xl">{title ?? "The projector went dark"}</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
          {message ??
            "We couldn't reach the movie database. It's usually a brief hiccup — try again in a moment and the reels should keep rolling."}
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-9"
          disabled={pending}
          onClick={() => startTransition(() => router.refresh())}
        >
          {pending ? "Retrying…" : "Try again"}
        </Button>
      </div>
    </section>
  );
}
