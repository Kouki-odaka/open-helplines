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
 * Root layout — provides the HTML shell.
 * Header, Footer, and locale handling are in [locale]/layout.tsx.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0a0e1a] text-gray-100">
        {children}
      </body>
    </html>
  );
}
