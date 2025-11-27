import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Output configuration
  output: 'standalone',
  
  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Разрешаем изображения с текущего домена
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pathvoyager.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'pathvoyager.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pathvoyager.com',
        pathname: '/uploads/**',
      },
    ],
    // Отключаем оптимизацию для локальных загруженных файлов (они уже оптимизированы)
    unoptimized: false,
  },
  
  // API rewrites для проксирования запросов к бэкенду
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // Если API_BASE_URL не установлен, проксируем к локальному серверу в development
    if (!apiBaseUrl || apiBaseUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4000/api/:path*',
        },
      ];
    }
    
    // В продакшене Nginx будет проксировать запросы напрямую к Unix socket
    // Поэтому rewrites не нужны
    return [];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
