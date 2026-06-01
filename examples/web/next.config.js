/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/open-helplines',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
