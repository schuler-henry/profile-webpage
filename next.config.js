/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
});

const withMDX = require('@next/mdx')();

const nextConfig = {
  experimental: {
    mdxRs: true,
  },
};

module.exports = withPWA(withMDX(nextConfig));
