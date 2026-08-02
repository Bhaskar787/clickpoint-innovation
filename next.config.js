/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
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
