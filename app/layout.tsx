import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner';
import MainNav from '@/components/navigation/MainNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SITE_URL } from '@/lib/constants/site';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Relógio Despertador Online',
    template: '%s · Relógio Despertador',
  },
  description:
    'Relógio Despertador online gratuito com alarme, cronômetro e temporizador.',
  keywords: 'relógio online, despertador online, cronômetro online, temporizador, pomodoro, hora mundial',
  openGraph: {
    title: 'Relógio Despertador Online',
    description:
      'Relógio Despertador online gratuito com alarme, cronômetro e temporizador.',
    type: 'website',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fbff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1628' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
    <head>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4208189640464365"
     crossOrigin="anonymous"></script>
  </head>
      <body className={`${inter.className} min-h-screen antialiased`}>      
        <ThemeProvider>
          <div className="app-shell-bg" aria-hidden />
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="relative flex-1">{children}</main>
            <SiteFooter />
            <CookieConsentBanner />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
