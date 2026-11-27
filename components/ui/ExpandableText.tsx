"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface ExpandableTextProps {
  text: string;
  /** Lines to show while collapsed (4, 6 or 8). */
  lines?: 4 | 6 | 8;
  threshold?: number;
  className?: string;
}

const CLAMP: Record<4 | 6 | 8, string> = {
  4: "line-clamp-4",
  6: "line-clamp-6",
  8: "line-clamp-8",
};

/** Long-form copy with an accessible, animated-free disclosure. */
export default function ExpandableText({ text, lines = 6, threshold = 420, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > threshold;

  return (
    <div className={className}>
      <p className={cn("text-sm leading-[1.85] whitespace-pre-line text-muted", !expanded && long && CLAMP[lines])}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-3 cursor-pointer text-xs font-semibold text-accent transition-colors hover:text-accent-strong"
        >
          {expanded ? "Show less" : "Read the full biography"}
        </button>
      )}
    </div>
  );
}
