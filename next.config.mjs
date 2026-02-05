// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Port backend
        pathname: '/uploads/**',
      },
      // Jika menggunakan IP lokal
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
    // Atau bisa juga domains (lebih sederhana)
    domains: ['localhost', '127.0.0.1'],
  },
};

export default nextConfig;