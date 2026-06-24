/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // <- ESTA LINHA é o que gera o .next/standalone
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig