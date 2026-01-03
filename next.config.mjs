/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // For Netlify static export
  distDir: 'dist',
  images: {
    unoptimized: true, // For static export
  },
  // Keep Capacitor compatibility
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

export default nextConfig
