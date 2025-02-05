/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.ignoreWarnings = [
      {
        message: /self is not defined/,
      },
    ];
    return config;
  },
};

export default nextConfig;
