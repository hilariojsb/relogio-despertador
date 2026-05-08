/** Alinha rótulo editorial da categoria ao slug usado no hub (`categorySlug`). */

function normalizeBlogCategoryLabel(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  const lower = t.toLocaleLowerCase('pt-BR');
  return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
}

export function blogCategorySlugFromArticle(categoryLabel: string): string | null {
  const label = normalizeBlogCategoryLabel(categoryLabel);
  if (!label) return null;
  const slug = label
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || null;
}
