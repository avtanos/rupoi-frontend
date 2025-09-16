/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/rupoi-frontend',
  assetPrefix: '/rupoi-frontend/',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'mock'
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'ignore-loader'
    })
    return config
  },
  experimental: {
    externalDir: true
  }
}

module.exports = nextConfig
