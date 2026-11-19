/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      {
        source: "/industries",
        destination: "/portfolio",
        permanent: true,
      },
      {
        source: "/industries/:id",
        destination: "/portfolio/:id",
        permanent: true,
      },
      {
        source: "/journey",
        destination: "/events",
        permanent: true,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent Webpack filesystem caching in dev to prevent ENOENT chunk errors & PackFileCacheStrategy corruption
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
