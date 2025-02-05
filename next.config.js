/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // No need to use CopyWebpackPlugin since files are already in public/dist
    return config;
  },
};

export default nextConfig;


