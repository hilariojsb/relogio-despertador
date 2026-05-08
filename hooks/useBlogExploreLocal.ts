'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  BLOG_EXPLORE_LOCAL_CHANGED,
  bumpExploreCategoryClick,
  loadExploreLocalSnapshot,
  notifyExploreLocalChanged,
  recordExploreArticleRead,
  type ExploreLocalSnapshot,
} from '@/lib/blog-explore-local-storage';

export function useBlogExploreLocal() {
  const [snapshot, setSnapshot] = useState<ExploreLocalSnapshot>(() => loadExploreLocalSnapshot());

  const refresh = useCallback(() => {
    setSnapshot(loadExploreLocalSnapshot());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(BLOG_EXPLORE_LOCAL_CHANGED, onChange);
    return () => window.removeEventListener(BLOG_EXPLORE_LOCAL_CHANGED, onChange);
  }, [refresh]);

  const recordArticle = useCallback((slug: string, title: string, href: string, categorySlug: string | null) => {
    recordExploreArticleRead(slug, title, href, categorySlug);
    notifyExploreLocalChanged();
  }, []);

  const registerCategoryUse = useCallback((categorySlug: string) => {
    bumpExploreCategoryClick(categorySlug);
    notifyExploreLocalChanged();
  }, []);

  return { snapshot, recordArticle, registerCategoryUse };
}
