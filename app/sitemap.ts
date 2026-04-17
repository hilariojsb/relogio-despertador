import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants/site';
import { DESPERTADOR_SEO_VARIANTS } from '@/lib/seo/despertador-keywords';

const base = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/despertador',
    '/cronometro',
    '/temporizador',
    '/pomodoro',
    '/hora-mundial',
    '/politica-de-privacidade',
    '/termos-de-uso',
    '/contato',
    '/sobre',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${base}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority:
      path === ''
        ? 1
        : path === '/politica-de-privacidade' ||
            path === '/termos-de-uso' ||
            path === '/contato' ||
            path === '/sobre'
          ? 0.5
          : 0.85,
  }));

  const despertadorSeo: MetadataRoute.Sitemap = DESPERTADOR_SEO_VARIANTS.map(v => ({
    url: `${base}/despertador/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticEntries, ...despertadorSeo];
}
