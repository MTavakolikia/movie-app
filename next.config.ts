module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image.tmdb.org",
        port: '',
        pathname: "/t/p/**",
        search: '',
      },
      {
        protocol: 'https',
        hostname: "images.unsplash.com",
        port: '',
        pathname: "/**",
        search: '',
      },
    ],
  },
}