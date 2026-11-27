/**
 * Local TMDb mock — lets the app run with full, realistic data when
 * api.themoviedb.org / image.tmdb.org are unreachable (blocked networks,
 * offline work, demos).
 *
 * Usage:
 *   node scripts/mock-tmdb.mjs                       # http://127.0.0.1:8321
 *   TMDB_API_BASE_URL=http://127.0.0.1:8321 npm run dev
 *   NEXT_PUBLIC_TMDB_IMAGE_BASE=http://127.0.0.1:8321/img  (for artwork)
 *
 * Data is deterministic per id. Images are generated on the fly with
 * sharp as cinematic gradient placeholders.
 */

import http from "node:http";
import crypto from "node:crypto";
import sharp from "sharp";

const PORT = Number(process.env.MOCK_PORT ?? 8321);

/* ---------------- deterministic pseudo-data ---------------- */

const MOVIE_GENRES = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" }, { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" },
  { id: 36, name: "History" }, { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" }, { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" }, { id: 10752, name: "War" }, { id: 37, name: "Western" },
];
const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" }, { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentary" }, { id: 18, name: "Drama" },
  { id: 10751, name: "Family" }, { id: 9648, name: "Mystery" }, { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10768, name: "War & Politics" },
];

const MOVIE_TITLES = [
  "The Midnight Reel", "Paper Empires", "A Distant Harbor", "Neon Undertow", "The Last Projectionist",
  "Salt & Static", "The Cartographer's Daughter", "Glasswater", "Sovereign Skies", "Fever Orchard",
  "The Understudy", "Copper Veins", "North of Nowhere", "The Velvet Circuit", "Half-Light",
  "The Tournament of Birds", "Bittermonsoon", "Signal Fires", "The Longest Winter", "Marble Season",
  "Fugue State", "The Bells of Rauma", "Bright Contender", "An Ocean of Minutes",
];
const TV_TITLES = [
  "Hollow Crown Road", "The Weatherhouse", "Deadfall Junction", "Fifth and Main", "The Ledger",
  "Wolfpack Avenue", "Slow Burn City", "The Long Con", "Meridian Falls", "Static Gardens",
];

const OVERVIEW_BITS = [
  "A disillusioned expert returns to the city she swore she had left behind, only to find every door held open by someone who knew her name.",
  "Two rival families discover they have been bidding on the same impossible prize — and only one of them knows what it truly is.",
  "When the lights fail across the peninsula, a modest archivist becomes the only person who can read what the dark leaves behind.",
  "A down-on-their-luck crew takes one final contract that promises more money than sense, and the fine print starts moving.",
  "The story of an unlikely partnership between a retired detective and the forger who once ruined her career.",
  "Every summer the island gives back one secret. This year, it gives back two.",
];
const TAGLINES = [
  "Every frame owes a debt.", "The truth develops in the dark.", "Some doors only open once.",
  "Not all signals are meant to be found.", "The past develops in the dark.", "Courage is a quiet frequency.",
];
const PEOPLE = [
  "Mara Ellison", "Devon Okada", "Ines Ferreiro", "Caleb Marsh", "Théo Lambert", "Priya Raghunathan",
  "Sigrid Holm", "Amara Diallo", "Jonas Petrov", "Lena Castellanos", "Rafe Underwood", "Yuki Tanabe",
];
const CHARACTERS = ["the Archivist", "Detective Rusk", "the Cartographer", "Mayor Hale", "the Understudy", "Captain Voss", "the Forger", "Night Clerk"];
const COMPANIES = ["Meridian Pictures", "Lantern House", "Northlight Studio", "Paper Kite Films", "Basalt Media"];
const JOB_PAIRS = [["Director", "Screenplay"], ["Director", "Story"], ["Screenplay", "Writer"], ["Creator"]];

function hashInt(text) {
  return parseInt(crypto.createHash("md5").update(text).digest("hex").slice(0, 8), 16);
}
function pick(array, seed, count = 1) {
  const out = [];
  let cursor = seed % array.length;
  for (let i = 0; i < count; i += 1) {
    out.push(array[cursor % array.length]);
    cursor += 1 + (seed % 5);
  }
  return out;
}
function idFor(index, isTv) {
  return (isTv ? 500000 : 100000) + index * 7;
}

const movies = MOVIE_TITLES.map((title, index) => {
  const seed = hashInt(title);
  const year = 1972 + (seed % 52);
  const month = String(1 + (seed % 12)).padStart(2, "0");
  const day = String(1 + (seed % 27)).padStart(2, "0");
  const genreIds = pick(MOVIE_GENRES.map((g) => g.id), seed, 2 + (seed % 2));
  return {
    _tv: false,
    id: idFor(index, false),
    title,
    overview: OVERVIEW_BITS[seed % OVERVIEW_BITS.length],
    poster_path: `/mv-${index}.jpg`,
    backdrop_path: `/bd-${index}.jpg`,
    genre_ids: genreIds,
    vote_average: Number((5.6 + (seed % 44) / 10).toFixed(1)),
    vote_count: 340 + (seed % 21000),
    release_date: `${year}-${month}-${day}`,
    popularity: 12 + (seed % 800),
    seed,
    year,
  };
});

const tvShows = TV_TITLES.map((name, index) => {
  const seed = hashInt(`${name}-tv`);
  const year = 1998 + (seed % 27);
  const month = String(1 + (seed % 12)).padStart(2, "0");
  const genreIds = pick(TV_GENRES.map((g) => g.id), seed, 2);
  return {
    _tv: true,
    id: idFor(index, true),
    name,
    overview: OVERVIEW_BITS[(seed + 2) % OVERVIEW_BITS.length],
    poster_path: `/tv-${index}.jpg`,
    backdrop_path: `/tvbd-${index}.jpg`,
    genre_ids: genreIds,
    vote_average: Number((6.1 + (seed % 38) / 10).toFixed(1)),
    vote_count: 210 + (seed % 9400),
    first_air_date: `${year}-${month}-04`,
    popularity: 20 + (seed % 640),
    seed,
    year,
  };
});

const allTitles = [...movies, ...tvShows];

function listItem(entry) {
  const base = entry._tv
    ? { name: entry.name, first_air_date: entry.first_air_date }
    : { title: entry.title, release_date: entry.release_date };
  return {
    ...base,
    id: entry.id,
    media_type: entry._tv ? "tv" : "movie",
    poster_path: entry.poster_path,
    backdrop_path: entry.backdrop_path,
    overview: entry.overview,
    genre_ids: entry.genre_ids,
    vote_average: entry.vote_average,
    vote_count: entry.vote_count,
    popularity: entry.popularity,
  };
}

function pageOf(items, pageParam) {
  const page = Math.max(1, Math.min(500, Number(pageParam) || 1));
  const size = 20;
  const start = (page - 1) * size;
  return {
    page,
    results: items.slice(start, start + size),
    total_pages: Math.max(1, Math.ceil(items.length / size)),
    total_results: items.length,
  };
}

function listFor(listName, type) {
  const pool = type === "tv" ? tvShows : movies;
  const sorted = [...pool].sort((a, b) => b.popularity - a.popularity);
  switch (listName) {
    case "top_rated": return sorted.sort((a, b) => b.vote_average - a.vote_average);
    case "now_playing": case "airing_today": case "on_the_air": return sorted.slice(0, 14);
    case "upcoming": return [...pool].sort((a, b) => b.year - a.year);
    default: return sorted;
  }
}

function detailsFor(entry) {
  const { seed } = entry;
  const cast = pick(PEOPLE, seed, 8).map((name, index) => ({
    id: 7000 + hashInt(name) % 900,
    name,
    character: CHARACTERS[(seed + index) % CHARACTERS.length],
    profile_path: `/p-${hashInt(name) % 60}.jpg`,
    order: index,
  }));
  const [firstJob, secondJob] = JOB_PAIRS[seed % JOB_PAIRS.length];
  const crew = pick(PEOPLE, seed + 3, 3).map((name, index) => ({
    id: 7000 + hashInt(name) % 900,
    name,
    job: index === 0 ? firstJob : secondJob ?? firstJob,
  }));
  const others = allTitles.filter((item) => item.id !== entry.id);
  const similar = pick(others, seed + 1, 8).map(listItem);
  const recommendations = pick(others, seed + 9, 10).map(listItem);
  const backdrops = Array.from({ length: 10 }, (_, index) => ({
    file_path: `/gal-${entry.id}-${index}.jpg`,
    aspect_ratio: 1.78,
  }));
  const videos = {
    results: [
      { id: "v1", key: `tmdb-${seed % 999}`, name: "Official Trailer", site: "YouTube", type: "Trailer", official: true },
      { id: "v2", key: `tmdb-tease-${seed % 99}`, name: "Teaser", site: "YouTube", type: "Teaser", official: false },
    ],
  };
  const reviews = {
    results: [0, 1, 2].map((index) => ({
      id: `rev-${entry.id}-${index}`,
      author: PEOPLE[(seed + index * 5) % PEOPLE.length],
      author_details: {
        name: PEOPLE[(seed + index * 5) % PEOPLE.length],
        username: `cinephile${(seed + index) % 99}`,
        avatar_path: null,
        rating: 7 + ((seed + index) % 3),
      },
      content:
        index === 0
          ? "A film that trusts its audience. The pacing is patient without ever becoming indulgent, and the final twenty minutes reframe everything that came before in the best possible way. The score deserves its own standing ovation."
          : index === 1
            ? "Gorgeous production design carries a script that occasionally bites off more than it can chew. Even where it stumbles, it stumbles beautifully — and the performances hold the centre together."
            : "I did not expect to be wrecked by this. Went in for the premise, stayed for the craft. The night sequences alone justify a big-screen viewing.",
      created_at: `${entry.year + 1}-03-1${index}T12:00:00.000Z`,
      url: `https://www.themoviedb.org/review/mock-${index}`,
    })),
  };

  const common = {
    id: entry.id,
    overview: entry.overview,
    poster_path: entry.poster_path,
    backdrop_path: entry.backdrop_path,
    vote_average: entry.vote_average,
    vote_count: entry.vote_count,
    popularity: entry.popularity,
    status: entry.year > 2024 ? "In Production" : "Released",
    tagline: TAGLINES[seed % TAGLINES.length],
    original_language: ["en", "en", "en", "ja", "fr", "ko"][seed % 6],
    homepage: "https://example.com/mock-title",
    production_companies: pick(COMPANIES, seed, 3).map((name, index) => ({
      id: 800 + index,
      name,
      logo_path: index === 0 ? `/l-${hashInt(name) % 30}.png` : null,
    })),
    spoken_languages: [
      { english_name: "English", name: "English" },
      { english_name: "Japanese", name: "日本語" },
    ],
    videos,
    images: { backdrops },
    reviews,
  };

  if (entry._tv) {
    return {
      ...common,
      name: entry.name,
      first_air_date: entry.first_air_date,
      genres: TV_GENRES.filter((g) => entry.genre_ids.includes(g.id)),
      episode_run_time: [44 + (seed % 12)],
      number_of_seasons: 1 + (seed % 6),
      number_of_episodes: 6 + (seed % 40),
      created_by: pick(PEOPLE, seed + 2, 2).map((name, index) => ({ id: 7000 + hashInt(name) % 900, name, job: index })),
      credits: { cast, crew: [] },
      similar: { results: similar },
      recommendations: { results: recommendations },
    };
  }
  return {
    ...common,
    title: entry.title,
    release_date: entry.release_date,
    runtime: 92 + (seed % 66),
    genres: MOVIE_GENRES.filter((g) => entry.genre_ids.includes(g.id)),
    budget: (5 + (seed % 90)) * 1_000_000,
    revenue: (20 + (seed % 480)) * 1_000_000,
    imdb_id: `tt${entry.id}`,
    credits: { cast, crew },
    similar: { results: similar },
    recommendations: { results: recommendations },
  };
}

function personFor(id) {
  const index = Math.abs(id) % PEOPLE.length;
  const name = PEOPLE[index];
  const seed = hashInt(`person-${name}`);
  return {
    id,
    name,
    biography: `${name} was born in ${["Lisbon", "Osaka", "Reykjavík", "Melbourne", "Montréal", "Cape Town"][seed % 6]} and trained at the ${["Conservatoire", "Drama Centre", "Film Academy"][seed % 3]} before a decade of stage work. A breakthrough supporting role led to a run of quietly acclaimed leads, and their collaborations with playwrights have become the stuff of programming lore. Off screen they champion archival restoration and youth cinema workshops, and remain famously indifferent to awards season.`,
    birthday: `19${60 + (seed % 34)}-0${1 + (seed % 9)}-1${seed % 9}`,
    place_of_birth: ["Lisbon, Portugal", "Osaka, Japan", "Reykjavík, Iceland", "Melbourne, Australia", "Montréal, Canada"][seed % 5],
    profile_path: `/p-${seed % 60}.jpg`,
    known_for_department: seed % 4 === 0 ? "Directing" : "Acting",
    combined_credits: {
      cast: pick(allTitles, seed, 10).map(listItem),
    },
  };
}

/* ---------------- image generation (sharp) ---------------- */

const SIZES = { w92: 92, w154: 154, w185: 185, w342: 342, w500: 500, w780: 780, w1280: 1280, original: 1280 };

function svgPlaceholder(width, height, hue) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${hue}, 42%, 20%)"/>
        <stop offset="0.55" stop-color="hsl(${(hue + 40) % 360}, 55%, 32%)"/>
        <stop offset="1" stop-color="hsl(${(hue + 90) % 360}, 38%, 12%)"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <circle cx="${width * 0.72}" cy="${height * 0.24}" r="${Math.min(width, height) * 0.16}" fill="hsl(43, 80%, 62%)" opacity="0.75"/>
  </svg>`;
}

async function serveImage(res, sizeKey, pathKey) {
  const width = SIZES[sizeKey] ?? 500;
  const isLogo = pathKey.includes("/l-") || pathKey.includes("png");
  const isBackdrop = pathKey.includes("bd") || pathKey.includes("gal");
  const [w, h] = isBackdrop ? [width, Math.round(width * 0.5625)] : isLogo ? [width, Math.round(width / 2.6)] : [width, Math.round(width * 1.5)];
  const hue = hashInt(pathKey) % 360;
  const jpeg = await sharp(Buffer.from(svgPlaceholder(w, h, hue)))
    .jpeg({ quality: 72 })
    .toBuffer();
  res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" });
  res.end(jpeg);
}

/* ---------------- routing ---------------- */

function json(res, payload, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const params = url.searchParams;
  const path = url.pathname;

  try {
    if (path.startsWith("/img/")) {
      const [, , sizeKey, ...rest] = path.split("/");
      return await serveImage(res, sizeKey, `/${rest.join("/")}`);
    }

    let match;

    if ((match = path.match(/^\/trending\/(all|movie|tv)\/(day|week)$/))) {
      const pool = match[1] === "movie" ? movies : match[1] === "tv" ? tvShows : allTitles;
      const items = pool.map(listItem);
      const sorted = match[2] === "day" ? [...items].reverse() : items;
      return json(res, pageOf(sorted, params.get("page")));
    }

    if ((match = path.match(/^\/(movie|tv)\/(popular|top_rated|now_playing|upcoming|airing_today|on_the_air)$/))) {
      return json(res, pageOf(listFor(match[2], match[1]).map(listItem), params.get("page")));
    }

    if ((match = path.match(/^\/discover\/(movie|tv)$/))) {
      const type = match[1];
      const genres = (params.get("with_genres") ?? "").split(",").filter(Boolean).map(Number);
      const minRating = Number(params.get("vote_average.gte") ?? 0);
      const language = params.get("with_original_language");
      const year = params.get("primary_release_year") ?? params.get("first_air_date_year");
      const runtimeGte = Number(params.get("with_runtime.gte") ?? 0);
      const runtimeLte = Number(params.get("with_runtime.lte") ?? 0);
      const keywordIds = (params.get("with_keywords") ?? "").split(",").filter(Boolean);
      const keywordOffset = keywordIds.length ? hashInt(keywordIds.join(",")) % 5 : 0;

      let pool = type === "tv" ? tvShows : movies;
      pool = pool.filter((entry) => {
        if (genres.length && !entry.genre_ids.some((id) => genres.includes(id))) return false;
        if (minRating && entry.vote_average < minRating) return false;
        if (language && entry.seed % 6 !== ["en", "en", "en", "ja", "fr", "ko"].indexOf(language)) if (language !== "en") return false;
        if (year && String(entry.year) !== year) return false;
        if (type === "movie" && runtimeGte && 92 + (entry.seed % 66) < runtimeGte) return false;
        if (type === "movie" && runtimeLte && 92 + (entry.seed % 66) > runtimeLte) return false;
        return true;
      });
      const sort = params.get("sort_by") ?? "popularity.desc";
      const sorted = [...pool].sort((a, b) => {
        switch (sort) {
          case "popularity.asc": return a.popularity - b.popularity;
          case "vote_average.desc": return b.vote_average - a.vote_average;
          case "vote_average.asc": return a.vote_average - b.vote_average;
          case "primary_release_date.desc": case "first_air_date.desc": return b.year - a.year;
          case "primary_release_date.asc": case "first_air_date.asc": return a.year - b.year;
          default: return b.popularity - a.popularity;
        }
      });
      const rotated = keywordOffset ? [...sorted.slice(keywordOffset), ...sorted.slice(0, keywordOffset)] : sorted;
      return json(res, pageOf(rotated.map(listItem), params.get("page")));
    }

    if ((match = path.match(/^\/search\/(multi|movie|tv)$/))) {
      const query = (params.get("query") ?? "").toLowerCase();
      let pool = match[1] === "movie" ? movies : match[1] === "tv" ? tvShows : allTitles;
      const items = pool
        .filter((entry) => (entry.title ?? entry.name).toLowerCase().includes(query))
        .map(listItem);
      return json(res, pageOf(items, params.get("page")));
    }

    if (path === "/search/keyword") {
      const query = params.get("query") ?? "";
      return json(res, { results: [{ id: 1234 + (hashInt(query) % 100), name: query }] });
    }

    if ((match = path.match(/^\/genre\/(movie|tv)\/list$/))) {
      return json(res, { genres: match[1] === "movie" ? MOVIE_GENRES : TV_GENRES });
    }

    if ((match = path.match(/^\/(movie|tv)\/(\d+)\/videos$/))) {
      const entry = allTitles.find((item) => String(item.id) === match[2]);
      const details = entry ? detailsFor(entry) : { videos };
      return json(res, details.videos);
    }

    if ((match = path.match(/^\/movie\/(\d+)\/recommendations$/))) {
      const entry = movies.find((item) => String(item.id) === match[1]);
      const details = entry ? detailsFor(entry) : { recommendations: { results: [] } };
      return json(res, pageOf(details.recommendations.results, params.get("page")));
    }

    if ((match = path.match(/^\/(movie|tv)\/(\d+)$/))) {
      const entry = allTitles.find((item) => String(item.id) === match[2]);
      if (!entry) return json(res, { status_message: "Resource not found." }, 404);
      return json(res, detailsFor(entry));
    }

    if ((match = path.match(/^\/person\/(\d+)$/))) {
      return json(res, personFor(Number(match[1])));
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status_message: `Mock has no route for ${path}` }));
  } catch (error) {
    console.error("[mock] error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status_message: "Mock error" }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[mock-tmdb] listening on http://127.0.0.1:${PORT}`);
  console.log(`[mock-tmdb] ${movies.length} films, ${tvShows.length} series, images generated on the fly`);
});
