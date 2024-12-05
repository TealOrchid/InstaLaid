/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/InstaLaid/' : '',
  basePath: isProd ? '/InstaLaid' : ''
};

export default nextConfig;
