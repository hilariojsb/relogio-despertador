import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Relógio Despertador',
    short_name: 'Relógio',
    description:
      'Relógio online com despertador, cronômetro, temporizador, Pomodoro e hora mundial no navegador.',
    start_url: '/',
    scope: '/',
    id: SITE_URL,
    display: 'standalone',
    background_color: '#0a1628',
    theme_color: '#0a1628',
    lang: 'pt-BR',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
