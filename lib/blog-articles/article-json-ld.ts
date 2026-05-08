import type { BlogArticle } from '@/lib/blog-articles/types';
import { resolvePublicAssetUrl, SITE_URL } from '@/lib/constants/site';

/** Objeto JSON-LD Article (schema.org) para SEO. */
export function getArticleJsonLd(article: BlogArticle): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const hero = article.heroImage.src ? resolvePublicAssetUrl(article.heroImage.src) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: `${article.publishedAt}T12:00:00-03:00`,
    dateModified: `${article.publishedAt}T12:00:00-03:00`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    author: {
      '@type': 'Organization',
      name: 'Relógio Despertador',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Relógio Despertador',
      url: SITE_URL,
    },
    inLanguage: 'pt-BR',
    articleSection: article.category,
    keywords: article.keywords?.join(', '),
    ...(hero ? { image: [hero] } : {}),
  };
}
