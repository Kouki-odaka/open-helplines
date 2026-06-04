import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Open Helplines — Global Crisis Support Data',
    template: '%s — Open Helplines',
  },
  description:
    'Open data registry of mental health and crisis helplines worldwide. ' +
    'Free · CC0 · No API key required.',
  keywords: ['mental health', 'crisis helpline', 'suicide prevention', 'open data', 'CC0'],
  openGraph: {
    siteName: 'Open Helplines',
    type: 'website',
  },
};

/**
 * Content Security Policy for the static site.
 *
 * Blocks all third-party tracking, analytics, and beacon endpoints.
 * Allows:
 *  - 'self'        — same-origin scripts, styles, fonts, data
 *  - 'unsafe-inline' scripts — Next.js RSC hydration inline scripts (<script>self.__next_f.push</script>)
 *  - 'unsafe-inline' styles — Tailwind/Next.js inline styles
 *  - 'unsafe-eval' scripts — Three.js requires eval for GLSL shader compilation
 *  - blob: / data: — canvas/3D globe textures
 *  - nominatim.openstreetmap.org — reverse geocoding for opt-in geolocation only
 *
 * Blocks: Google Analytics, Mixpanel, Segment, HotJar, Facebook Pixel,
 *         and any other third-party JS or beacon.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://nominatim.openstreetmap.org https://cdn.jsdelivr.net",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/**
 * Root layout — provides the HTML shell and security headers via meta tags.
 * Header, Footer, and locale handling are in [locale]/layout.tsx.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Content Security Policy — blocks all 3rd-party tracking */}
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        {/* Prevent Referrer leakage from crisis-related navigation */}
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0a0e1a] text-gray-100">
        {children}
      </body>
    </html>
  );
}
