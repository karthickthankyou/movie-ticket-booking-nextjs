/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' },
      { hostname: 'firebasestorage.googleapis.com' },
    ],
  },
}

export default nextConfig
