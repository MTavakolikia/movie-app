module.exports = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    remotePatterns: [

      {
        protocol: 'https',
        hostname: "image.tmdb.org",
        port: '',
        pathname: "/t/p/**",
        search: '',
      },
    ],
  },
}