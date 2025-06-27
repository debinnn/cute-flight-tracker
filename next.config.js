/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  images: {
    remotePatterns: [],
  },
  // Environment variables will be available at build time
  env: {
    NEXT_PUBLIC_AVIATIONSTACK_API_KEY: process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY,
  },
}

module.exports = nextConfig