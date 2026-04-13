import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainNav from '@/components/navigation/MainNav';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://relogiodespertador.com.br'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'TimeOS — Relógio e ferramentas de tempo',
    template: '%s · TimeOS',
  },
  description:
    'Relógio digital, despertador online, cronômetro, temporizador, Pomodoro e hora mundial — tudo em um só lugar. Rápido, preciso e leve.',
  keywords: 'relógio online, despertador online, cronômetro online, temporizador online, pomodoro online, hora mundial, timer online, alarme online',
  openGraph: {
    title: 'TimeOS — Relógio e ferramentas de tempo',
    description: 'Ferramentas de tempo modernas para o seu dia a dia.',
    type: 'website',
       url: 'https://relogiodespertador.com.br',
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
          <MainNav />
          <main className="relative min-h-[calc(100vh-3.5rem)]">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
