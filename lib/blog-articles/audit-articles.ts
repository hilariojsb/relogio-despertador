import type { BlogArticle } from '@/lib/blog-articles/types';

export type ArticleAuditSeverity = 'critical' | 'warning';

export type ArticleAuditIssueType =
  | 'missing_category'
  | 'missing_tags'
  | 'invalid_tags_format'
  | 'accent_in_tag'
  | 'uppercase_tag'
  | 'empty_tag_string';

export type ArticleAuditIssue = {
  type: ArticleAuditIssueType;
  slug: string;
  title: string;
  index: number;
  tag?: string;
  severity: ArticleAuditSeverity;
};

/** Letras acentuadas comuns em pt-BR (tags devem ser ASCII slug-like). */
const ACCENT_IN_TAG_RE = /[áàãâéêíóôõúç]/i;

function pushIssue(
  issues: ArticleAuditIssue[],
  partial: Omit<ArticleAuditIssue, 'severity'> & { severity?: ArticleAuditSeverity },
) {
  const severity: ArticleAuditSeverity =
    partial.severity ??
    (partial.type === 'missing_category' ||
    partial.type === 'invalid_tags_format' ||
    partial.type === 'empty_tag_string'
      ? 'critical'
      : 'warning');
  issues.push({ ...partial, severity });
}

/**
 * Audita artigos (idealmente já passados por {@link normalizeArticles} para tags estáveis).
 */
export function auditArticles(articles: BlogArticle[]): ArticleAuditIssue[] {
  const issues: ArticleAuditIssue[] = [];

  articles.forEach((article, index) => {
    const slug = article.slug;
    const title = article.title;

    if (!article.category?.trim()) {
      pushIssue(issues, {
        type: 'missing_category',
        slug,
        title,
        index,
        severity: 'critical',
      });
    }

    const tags = article.tags;

    if (tags == null || (Array.isArray(tags) && tags.length === 0)) {
      pushIssue(issues, {
        type: 'missing_tags',
        slug,
        title,
        index,
        severity: 'warning',
      });
    }

    if (tags != null && !Array.isArray(tags)) {
      pushIssue(issues, {
        type: 'invalid_tags_format',
        slug,
        title,
        index,
        severity: 'critical',
      });
      return;
    }

    if (!Array.isArray(tags)) return;

    tags.forEach((tag) => {
      if (typeof tag !== 'string' || !tag.trim()) {
        pushIssue(issues, {
          type: 'empty_tag_string',
          slug,
          title,
          index,
          tag: String(tag),
          severity: 'critical',
        });
        return;
      }
      if (ACCENT_IN_TAG_RE.test(tag)) {
        pushIssue(issues, {
          type: 'accent_in_tag',
          slug,
          title,
          index,
          tag,
          severity: 'warning',
        });
      }
      if (tag !== tag.toLowerCase()) {
        pushIssue(issues, {
          type: 'uppercase_tag',
          slug,
          title,
          index,
          tag,
          severity: 'warning',
        });
      }
    });
  });

  return issues;
}

/**
 * Cópia superficial com tags normalizadas (minúsculas, sem acentos, únicas).
 * Não altera os módulos fonte — uso em runtime (ex.: hub do blog).
 */
export function normalizeArticles(articles: BlogArticle[]): BlogArticle[] {
  return articles.map((article) => {
    let raw: unknown = article.tags ?? [];
    if (!Array.isArray(raw)) {
      raw = [raw];
    }
    const normalizedTags = (raw as unknown[])
      .map((t) =>
        String(t)
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      )
      .filter((t) => t.length > 0);

    const deduped = Array.from(new Set(normalizedTags));

    return {
      ...article,
      tags: deduped.length > 0 ? deduped : undefined,
    };
  });
}

export function countByCategory(articles: BlogArticle[]): Record<string, number> {
  return articles.reduce<Record<string, number>>((acc, article) => {
    const cat = article.category?.trim() || 'sem_categoria';
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});
}

export function countByTag(articles: BlogArticle[]): Record<string, number> {
  const map: Record<string, number> = {};

  for (const article of articles) {
    const tags = article.tags;
    if (!Array.isArray(tags)) continue;
    for (const tag of tags) {
      if (typeof tag !== 'string' || !tag.trim()) continue;
      map[tag] = (map[tag] ?? 0) + 1;
    }
  }

  return map;
}

export function countAuditCriticalIssues(issues: ArticleAuditIssue[]): number {
  return issues.filter((i) => i.severity === 'critical').length;
}
