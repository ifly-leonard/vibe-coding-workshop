/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["app", "src"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glb$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
