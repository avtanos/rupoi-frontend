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
  webpack: (config, { isServer }) => {
    // Игнорируем .vue файлы
    config.module.rules.push({
      test: /\.vue$/,
      loader: 'ignore-loader'
    })
    
    // Исправляем проблемы с модулями
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  experimental: {
    externalDir: true
  }
}

module.exports = nextConfig
