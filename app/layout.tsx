import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Instrument_Serif, Space_Mono } from 'next/font/google';
import './globals.css';

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aaronauld.com';
const description =
  'Full-stack engineer in Sydney, looking to move to New York. React, TypeScript, React Native, .NET and Azure.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Aaron Auld — Full-stack engineer',
  description,
  authors: [{ name: 'Aaron Auld', url: siteUrl }],
  creator: 'Aaron Auld',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Aaron Auld',
    title: 'Aaron Auld — Full-stack engineer',
    description,
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaron Auld — Full-stack engineer',
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F9F3EC',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
