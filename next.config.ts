import type { NextConfig } from "next";

/*
 * Image sources. The second block allows http://localhost mirrors of the
 * TMDb image CDN (see NEXT_PUBLIC_TMDB_IMAGE_BASE and
 * scripts/mock-tmdb.mjs) so the app can run fully offline on networks
 * where the CDN is unreachable.
 */
const nextConfig: NextConfig = {
  images: {
    // Permit local image mirrors (scripts/mock-tmdb.mjs, or a user-hosted
    // proxy) — harmless unless someone actually configures one via
    // NEXT_PUBLIC_TMDB_IMAGE_BASE.
    dangerouslyAllowLocalIP: true,
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
        search: "",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/img/**",
        search: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/img/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
