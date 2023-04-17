const withImages = require('next-images')
module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  withImages: {
    esModule: true,
  },
};
