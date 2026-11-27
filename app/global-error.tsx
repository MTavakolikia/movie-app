"use client";

/* ============================================================
   Global error boundary — renders when the root layout itself
   fails, so it carries its own minimal styling.
   ============================================================ */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#0a0b0f",
          color: "#f4f5f9",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e8b954",
              fontWeight: 600,
              margin: "0 0 16px",
            }}
          >
            Something went wrong
          </p>
          <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", lineHeight: 0.95, margin: "0 0 16px" }}>
            The projector failed.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#a3aabd", margin: 0 }}>
            A critical error stopped the application from starting. {error.digest ? `Reference: ${error.digest}` : ""}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 28,
              padding: "12px 28px",
              borderRadius: 999,
              border: 0,
              background: "#e8b954",
              color: "#1a1206",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
