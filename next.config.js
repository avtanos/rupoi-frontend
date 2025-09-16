/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  // Только для продакшена используем export и basePath
  ...(isProduction && {
    output: 'export',
    basePath: '/rupoi-frontend',
    assetPrefix: '/rupoi-frontend/',
  }),
  trailingSlash: true,
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
