/** Artigo ou registro mínimo com `tags` opcionais. */
export type WithOptionalTags = {
  tags?: string[];
};

/**
 * Filtra por uma tag. Artigos sem `tags` ou sem a tag informada ficam de fora.
 */
export function filterByTag<T extends WithOptionalTags>(articles: T[], tag: string): T[] {
  return articles.filter((article) => Array.isArray(article.tags) && article.tags.includes(tag));
}

/**
 * Filtra por várias tags.
 * - `all`: o artigo deve conter todas as tags (intersecção).
 * - `any`: o artigo deve conter ao menos uma das tags (união).
 */
export function filterByTags<T extends WithOptionalTags>(
  articles: T[],
  tags: string[],
  mode: 'all' | 'any' = 'all'
): T[] {
  if (!tags.length) return articles;

  return articles.filter((article) => {
    const t = article.tags;
    if (!Array.isArray(t) || t.length === 0) return false;
    if (mode === 'all') return tags.every((tag) => t.includes(tag));
    return tags.some((tag) => t.includes(tag));
  });
}
