import CopyWebpackPlugin from 'copy-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './node_modules/@deriv/deriv-chart/dist/*.smartcharts.*',
            to: 'public/dist/[name][ext]',
            flatten: true,
          },
          {
            from: './node_modules/@deriv/deriv-chart/dist/smartcharts.css',
            to: 'public/dist/smartcharts.css',
            flatten: true,
          },
        ],
      })
    );
    return config;
  },
};

export default nextConfig;

