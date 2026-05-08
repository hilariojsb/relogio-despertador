'use client';

import { useEffect } from 'react';
import {
  notifyExploreLocalChanged,
  recordExploreArticleRead,
} from '@/lib/blog-explore-local-storage';
import { blogCategorySlugFromArticle } from '@/lib/blog-explore-article-category';

type Props = {
  slug: string;
  title: string;
  /** Categoria editorial do artigo (para última categoria no Explore). */
  articleCategoryLabel: string;
};

/**
 * Ao abrir um artigo, atualiza histórico local usado na sidebar do hub.
 */
export function BlogArticleExploreTracker({ slug, title, articleCategoryLabel }: Props) {
  useEffect(() => {
    const categorySlug = blogCategorySlugFromArticle(articleCategoryLabel);
    recordExploreArticleRead(slug, title, `/blog/${slug}`, categorySlug);
    notifyExploreLocalChanged();
  }, [slug, title, articleCategoryLabel]);

  return null;
}
