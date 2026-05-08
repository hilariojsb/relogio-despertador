import { SITE_URL } from '@/lib/constants/site';
import type { BlogArticle } from '@/lib/blog-articles/types';

/** Hostname do site público (sem www), derivado de {@link SITE_URL}. */
function canonicalSiteHostname(): string | null {
  try {
    return new URL(SITE_URL).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isInternalHostname(host: string, siteHost: string | null): boolean {
  const h = host.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1') return true;
  if (!siteHost) return false;
  return h === siteHost || h === `www.${siteHost}`;
}

/** Remove pontuação/colchetes/parenteses finais comuns após URLs soltas no texto. */
function trimTrailingUrlClosers(raw: string): string {
  return raw.replace(/(?:[.,;:!?]+|\)+|\]+)+$/g, '');
}

/**
 * `href="..."` em HTML solto no corpo: mesmo host do site ou ambiente local → caminho relativo.
 */
function sanitizeHtmlHrefAttributes(fragment: string): string {
  return fragment.replace(/\bhref\s*=\s*(["'])([^"']*)\1/gi, (match, quote: string, url: string) => {
    const t = url.trim();
    const n = normalizeBlogContentHref(t);
    if (n.external) return match;
    return `href=${quote}${n.href}${quote}`;
  });
}

/**
 * URLs absolutas soltas (fora de `[text](url)`): dev ou domínio oficial → `/...`
 */
function sanitizeBareInternalUrls(fragment: string): string {
  const siteHost = canonicalSiteHostname();
  let result = '';
  let i = 0;
  const reStart = /\bhttps?:\/\//gi;

  while (i < fragment.length) {
    reStart.lastIndex = i;
    const m = reStart.exec(fragment);
    if (!m || m.index === undefined) {
      result += fragment.slice(i);
      break;
    }
    result += fragment.slice(i, m.index);
    const start = m.index;
    let end = start + m[0].length;
    while (end < fragment.length) {
      const ch = fragment[end];
      if (/\s/.test(ch)) break;
      if (ch === '<') break;
      end++;
    }
    let raw = fragment.slice(start, end);
    raw = trimTrailingUrlClosers(raw);
    try {
      const u = new URL(raw);
      if (isInternalHostname(u.hostname, siteHost)) {
        result += `${u.pathname}${u.search}${u.hash}` || '/';
      } else {
        result += fragment.slice(start, end);
      }
    } catch {
      result += fragment.slice(start, end);
    }
    i = end;
  }

  return result;
}

/**
 * Normaliza links internos no corpo.
 * 1) `[rótulo](url)` primeiro (evita tratar `)` do Markdown como parte da URL);
 * 2) `href=` em HTML;
 * 3) URLs absolutas soltas.
 */
export function sanitizeBlogBodyText(text: string): string {
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(text)) !== null) {
    const between = text.slice(last, m.index);
    out += sanitizeBareInternalUrls(sanitizeHtmlHrefAttributes(between));
    const href = normalizeBlogContentHref(m[2].trim());
    out += `[${m[1]}](${href.href})`;
    last = linkRe.lastIndex;
  }

  const tail = text.slice(last);
  out += sanitizeBareInternalUrls(sanitizeHtmlHrefAttributes(tail));
  return out;
}

/** Aplica {@link sanitizeBlogBodyText} aos campos textuais do artigo (exceto imagens, slug, metadados estruturais). */
export function sanitizeBlogArticleProse(article: BlogArticle): BlogArticle {
  const s = (t: string) => sanitizeBlogBodyText(t);

  return {
    ...article,
    description: s(article.description),
    tagline: article.tagline?.trim() ? s(article.tagline.trim()) : undefined,
    keywords: article.keywords?.map((kw) => s(kw)),
    quickSummary: article.quickSummary.map(s),
    intro: article.intro.map(s),
    conclusion: article.conclusion.map(s),
    tip: article.tip?.trim() ? s(article.tip.trim()) : undefined,
    sections: article.sections.map((sec) => ({
      ...sec,
      h2: s(sec.h2),
      paragraphs: sec.paragraphs.map(s),
      list: sec.list?.map((item) => s(item)),
      subsections: sec.subsections?.map((sub) => ({
        ...sub,
        h3: s(sub.h3),
        paragraphs: sub.paragraphs.map(s),
        list: sub.list?.map((item) => s(item)),
      })),
      highlights: sec.highlights?.map((h) => ({
        ...h,
        body: s(h.body),
      })),
    })),
  };
}

/** Para validação pós-normalização: barrar dev absoluto residual no objeto artigo. */
export function proseStillContainsDevAbsoluteUrl(article: BlogArticle): boolean {
  return /https?:\/\/(?:127\.0\.0\.1|\[::1\]|localhost)(?::\d+)?/i.test(JSON.stringify(article));
}

export type NormalizedContentHref = {
  href: string;
  /** `true` quando deve usar `<a>` nativa (externo, mailto, etc.). */
  external: boolean;
};

/**
 * Normaliza href de markdown `[rótulo](href)` para navegação interna ou externa.
 * Ambiente local (127.0.0.1, ::1, hostname de dev) e domínio oficial → caminhos relativos.
 */
export function normalizeBlogContentHref(rawHref: string): NormalizedContentHref {
  const href = rawHref.trim();
  if (!href || href.startsWith('#')) {
    return { href: href || '#', external: false };
  }
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return { href, external: true };
  }
  if (href.startsWith('/') && !href.startsWith('//')) {
    return { href, external: false };
  }
  if (href.startsWith('//')) {
    return { href, external: true };
  }

  try {
    const u = new URL(href);
    const host = u.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1') {
      const path = `${u.pathname}${u.search}${u.hash}` || '/';
      return { href: path, external: false };
    }
    const siteHost = canonicalSiteHostname();
    if (siteHost && (host === siteHost || host === `www.${siteHost}`)) {
      const path = `${u.pathname}${u.search}${u.hash}` || '/';
      return { href: path, external: false };
    }
    return { href, external: true };
  } catch {
    return { href: '#', external: false };
  }
}
