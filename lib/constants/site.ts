/**
 * URL canônica do site em produção (HTTPS, sem barra final).
 * Usar para canonical, Open Graph, JSON-LD, sitemap e qualquer link absoluto público.
 */
export const SITE_URL = 'https://relogiodespertador.com.br' as const;

/** Caminho relativo ao site ou URL absoluta (ex.: Cloudinary) para OG/schema. */
export function resolvePublicAssetUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith('/') ? src : `/${src}`}`;
}

export const CONTACT_EMAIL = 'contato@relogiodespertador.com.br' as const;

export const COOKIE_CONSENT_STORAGE_KEY = 'relogio_despertador_cookie_consent' as const;
