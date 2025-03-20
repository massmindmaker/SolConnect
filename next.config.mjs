/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Включение статической оптимизации для страниц
  staticPageGenerationTimeout: 180,

  // Конфигурация для изображений
  images: {
    domains: ['solana.com', 'placekitten.com'],
    formats: ['image/avif', 'image/webp'],
  },

  // Конфигурация для webpack
  webpack: (config, { isServer }) => {
    // Для поддержки модулей с большими пакетами
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000,
      aggregateTimeout: 300,
    };

    // Добавление поддержки полифиллов для Web3
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
      };
    }

    return config;
  },

  // Экспериментальные функции
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@solana/web3.js'],
  },

  // Пути API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;