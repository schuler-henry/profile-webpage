const { InjectManifest } = require('workbox-webpack-plugin');

/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
      {
        urlPattern: '/**',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
        },
      },
    ],
  },
});

const withMDX = require('@next/mdx')();

const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'henryschuler.de',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA(withMDX(nextConfig));
