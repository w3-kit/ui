/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ipfs.io", "gateway.pinata.cloud", "arweave.net", "cloudflare-ipfs.com"],
  },
};

module.exports = nextConfig;
