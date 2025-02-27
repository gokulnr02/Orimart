const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  webpack: (config) => {
    // Your custom webpack configurations
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?mjs$/,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
