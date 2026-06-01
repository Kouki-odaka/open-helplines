import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

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
    locale: 'en_US',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#0a0e1a] text-gray-100">
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
