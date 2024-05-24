const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = {
  ...withBundleAnalyzer({}),
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    GRADUATE_API: process.env.GRADUATE_API,
  },
  devIndicators: {
    buildActivity: false,
  },
}
