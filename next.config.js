const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,

  reactStrictMode: true,
  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
  images: {
    domains: ['web-notes.me', 'dev-chat.me', 'henry-schuler.vercel.app', 'henryschuler.de', 'avatars.githubusercontent.com', 'www.adsimple.at'],
  },
  optimizeFonts: false,
}

module.exports = nextConfig
