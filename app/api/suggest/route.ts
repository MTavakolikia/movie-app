import { NextResponse, type NextRequest } from "next/server";
import { search } from "@/services/tmdb";

/* ============================================================
   Search suggestions — a tiny server proxy so the TMDb token
   never reaches the browser. Titles only; no personal data.
   ============================================================ */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") ?? "";
  const query = raw.trim().slice(0, 80);
  const type = request.nextUrl.searchParams.get("type") === "tv" ? "tv" : "movie";

  if (query.length < 2) {
    return NextResponse.json({ results: [], unavailable: false });
  }

  const data = await search(query, type, 1);
  const results = data.results.slice(0, 6).map((item) => ({
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    posterPath: item.posterPath,
    releaseDate: item.releaseDate,
    voteAverage: item.voteAverage,
  }));

  return NextResponse.json(
    { results, unavailable: data.unavailable },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
