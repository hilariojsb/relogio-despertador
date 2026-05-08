import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner';
import MainNav from '@/components/navigation/MainNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SITE_URL } from '@/lib/constants/site';
import Script from 'next/script';

const CLARITY_PROJECT_ID = 'wo4s0o5zyn';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Relógio Despertador Online Grátis (Com Alarme, Cronômetro e Temporizador)',
    template: '%s · Relógio Despertador',
  },
  description:
    'Relógio online com hora do dispositivo, despertador, cronômetro, temporizador, Pomodoro e hora mundial no navegador, com artigos sobre rotina. Gratuito, sem instalar aplicativo; funciona no celular e no computador.',
  keywords: 'relógio online, despertador online, cronômetro online, temporizador online, pomodoro online, hora mundial, timer online, alarme online',
  openGraph: {
    title: 'Relógio Despertador Online',
    description:
      'Relógio online, despertador, cronômetro, temporizador, Pomodoro e hora mundial no navegador, com conteúdos sobre rotina. Gratuito, sem instalar app.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Relógio Despertador',
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
        </Script>
      </body>
    </html>
  );

}
