import { cn } from "@/lib/cn";

/* ============================================================
   RatingRing — circular score that fills on first paint.
   "artwork" sits on a poster/backdrop; "surface" on a panel.
   ============================================================ */

interface RatingRingProps {
  /** 0–10 scale. */
  value: number;
  size?: number;
  tone?: "surface" | "artwork";
  className?: string;
}

export default function RatingRing({ value, size = 68, tone = "surface", className }: RatingRingProps) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(10, Number.isFinite(value) ? value : 0));
  const score = clamped.toFixed(1);
  const track = tone === "artwork" ? "rgb(255 255 255 / 0.18)" : "var(--line-strong)";

  return (
    <span
      role="img"
      aria-label={`Rated ${score} out of 10`}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          className="ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: circumference * (1 - clamped / 10), ["--circumference" as string]: circumference }}
        />
      </svg>
      <span
        className={cn(
          "absolute font-display text-2xl leading-none tabular",
          tone === "artwork" ? "text-white" : "text-ink",
        )}
      >
        {score}
      </span>
    </span>
  );
}
