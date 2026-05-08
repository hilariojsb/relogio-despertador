import type { FeaturedPost } from '@/components/blog-landing/data';

export type HubArticleTagMeta = {
  slug: string;
  tags?: string[];
};

/** Alias usado na página do blog e na landing. */
export type BlogArticleTagMeta = HubArticleTagMeta;

export function slugFromFeaturedHref(href: string): string {
  return href.startsWith('/blog/') ? href.slice('/blog/'.length) : href;
}

export type FeaturedPostsFilterOptions = {
  categorySlug: string | null;
  /** Todas as tags selecionadas precisam estar no artigo (AND entre tags). */
  selectedTags: string[];
  search: string;
};

/**
 * Filtra posts em destaque do hub: categoria + tags (AND entre tags) + busca no título/resumo.
 */
export function filterFeaturedPosts(
  posts: FeaturedPost[],
  metaBySlug: Map<string, HubArticleTagMeta>,
  opts: FeaturedPostsFilterOptions,
): FeaturedPost[] {
  let list = [...posts];
  const q = opts.search.trim().toLowerCase();

  if (opts.categorySlug) {
    list = list.filter((p) => p.categorySlug === opts.categorySlug);
  }

  if (opts.selectedTags.length > 0) {
    list = list.filter((p) => {
      const slug = slugFromFeaturedHref(p.href);
      const meta = metaBySlug.get(slug);
      const tags = meta?.tags;
      if (!tags?.length) return false;
      return opts.selectedTags.every((tag) => tags.includes(tag));
    });
  }

  if (q) {
    list = list.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
    );
  }

  return list;
}
