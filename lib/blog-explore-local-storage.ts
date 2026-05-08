/**
 * Estado local do bloco “Explore por tema”: última leitura, última categoria, afividade por clique.
 */

export const BLOG_EXPLORE_STORAGE_KEY = 'rd-blog-explore-v1';

export const BLOG_EXPLORE_LOCAL_CHANGED = 'blog-explore-local-changed';

export type ExploreLastArticle = {
  slug: string;
  title: string;
  href: string;
  at: number;
};

export type ExploreLocalSnapshot = {
  lastArticle: ExploreLastArticle | null;
  lastCategorySlug: string | null;
  categoryClicks: Record<string, number>;
};

const DEFAULT_SNAPSHOT: ExploreLocalSnapshot = {
  lastArticle: null,
  lastCategorySlug: null,
  categoryClicks: {},
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadExploreLocalSnapshot(): ExploreLocalSnapshot {
  if (!isBrowser()) return { ...DEFAULT_SNAPSHOT };
  try {
    const raw = window.localStorage.getItem(BLOG_EXPLORE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SNAPSHOT };
    const data = JSON.parse(raw) as Partial<ExploreLocalSnapshot>;
    return {
      lastArticle:
        data.lastArticle &&
        typeof data.lastArticle.slug === 'string' &&
        typeof data.lastArticle.title === 'string' &&
        typeof data.lastArticle.href === 'string' &&
        typeof data.lastArticle.at === 'number'
          ? data.lastArticle
          : null,
      lastCategorySlug:
        typeof data.lastCategorySlug === 'string' || data.lastCategorySlug === null
          ? data.lastCategorySlug ?? null
          : null,
      categoryClicks:
        data.categoryClicks && typeof data.categoryClicks === 'object' && !Array.isArray(data.categoryClicks)
          ? data.categoryClicks
          : {},
    };
  } catch {
    return { ...DEFAULT_SNAPSHOT };
  }
}

export function saveExploreLocalSnapshot(next: ExploreLocalSnapshot): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(BLOG_EXPLORE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function notifyExploreLocalChanged(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(BLOG_EXPLORE_LOCAL_CHANGED));
}

export function recordExploreArticleRead(
  slug: string,
  title: string,
  href: string,
  categorySlug: string | null,
): ExploreLocalSnapshot {
  const prev = loadExploreLocalSnapshot();
  const next: ExploreLocalSnapshot = {
    ...prev,
    lastArticle: { slug, title, href, at: Date.now() },
    lastCategorySlug: categorySlug ?? prev.lastCategorySlug,
  };
  saveExploreLocalSnapshot(next);
  return next;
}

export function bumpExploreCategoryClick(categorySlug: string): ExploreLocalSnapshot {
  const prev = loadExploreLocalSnapshot();
  const n = (prev.categoryClicks[categorySlug] ?? 0) + 1;
  const next: ExploreLocalSnapshot = {
    ...prev,
    categoryClicks: { ...prev.categoryClicks, [categorySlug]: n },
    lastCategorySlug: categorySlug,
  };
  saveExploreLocalSnapshot(next);
  return next;
}
