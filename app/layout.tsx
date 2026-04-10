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
  metadataBase: new URL('https://relogiodespertador.com.br'),
  title: {
    default: 'Relógio Despertador Online Grátis (Com Alarme, Cronômetro e Temporizador)',
    template: '%s · Relógio Despertador',
  },
  description:
    'Use o relógio despertador online grátis com alarme, cronômetro e temporizador. Simples, rápido e funciona no celular e computador sem instalar.',
  keywords: 'relógio online, despertador online, cronômetro online, temporizador online, pomodoro online, hora mundial, timer online, alarme online',
  openGraph: {
    title: 'Relógio Despertador Online',
    description:
      'Use o relógio despertador online grátis com alarme, cronômetro e temporizador. Simples, rápido e funciona no celular e computador sem instalar.',
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
