/** @type {import('next').NextConfig} */
const SITE_BASE_PATH = '/open-helplines';

const nextConfig = {
  output: 'export',
  basePath: SITE_BASE_PATH,
  // Expose basePath as an env variable for client-side asset URL construction.
  // fetch() does not inherit basePath automatically; components use this constant.
  env: {
    NEXT_PUBLIC_BASE_PATH: SITE_BASE_PATH,
  },
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
