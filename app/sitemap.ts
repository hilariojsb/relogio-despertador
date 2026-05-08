import type { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/blog-articles';
import { SITE_URL } from '@/lib/constants/site';
import { TIMER_PAGE_MINUTES, timerPagePath } from '@/lib/constants/despertador-timer-pages';

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
    '/blog',
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

  const despertadorTimerPages: MetadataRoute.Sitemap = TIMER_PAGE_MINUTES.map(m => ({
    url: `${base}${timerPagePath(m)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.78,
  }));

  const blogArticles: MetadataRoute.Sitemap = getAllBlogSlugs().map(slug => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...blogArticles, ...despertadorTimerPages];
}
