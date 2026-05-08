'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BlogContinueLearningSection } from '@/components/blog-landing/BlogContinueLearningSection';
import { BlogDevAuditBanner } from '@/components/blog-landing/BlogDevAuditBanner';
import { BlogEvolucaoCtaSection } from '@/components/blog-landing/BlogEvolucaoCtaSection';
import { BlogFeaturedSection } from '@/components/blog-landing/BlogFeaturedSection';
import { BlogFaqSection } from '@/components/blog-landing/BlogFaqSection';
import { BlogGuidesSection } from '@/components/blog-landing/BlogGuidesSection';
import { BlogHero } from '@/components/blog-landing/BlogHero';
import { BlogSidebar } from '@/components/blog-landing/BlogSidebar';
import { BlogToolbar } from '@/components/blog-landing/BlogToolbar';
import { BlogToolsCtaSection } from '@/components/blog-landing/BlogToolsCtaSection';
import { FEATURED_POSTS, type FeaturedPost } from '@/components/blog-landing/data';
import {
  pickRotatedFeaturedPosts,
  ROTATION_INTERVAL_MS,
  sortFeaturedPostsByDateDesc,
} from '@/components/blog-landing/featured-rotation';
import { filterFeaturedPosts } from '@/components/blog-landing/filter-featured-posts';
import type { BlogArticleTagMeta } from '@/components/blog-landing/filter-featured-posts';
import { slugFromFeaturedHref } from '@/components/blog-landing/filter-featured-posts';
import { useBlogExploreLocal } from '@/hooks/useBlogExploreLocal';
import { useRotationTimeBucket } from '@/hooks/useRotationTimeBucket';
import type { ArticleAuditIssue, BlogCategoryCountRow } from '@/lib/blog-articles';
import type { BlogIntentTagId } from '@/lib/blog-articles/blog-intent-tags';

export type { BlogArticleTagMeta };

type BlogLandingViewProps = {
  /** Bucket de rotação calculado no servidor para hidratação consistente. */
  initialRotationBucket: number;
  /** Bucket para a lista "Mais populares" (intervalo próprio, ex. 4 h). */
  initialPopularRotationBucket: number;
  categoryCounts: BlogCategoryCountRow[];
  articlesTagMeta: BlogArticleTagMeta[];
  /** Somente em desenvolvimento: problemas da auditoria de artigos. */
  devAuditIssues?: ArticleAuditIssue[];
};

export function BlogLandingView({
  initialRotationBucket,
  initialPopularRotationBucket,
  categoryCounts,
  articlesTagMeta,
  devAuditIssues,
}: BlogLandingViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const explore = useBlogExploreLocal();

  const onArticleFromPost = useCallback(
    (post: FeaturedPost) => {
      explore.recordArticle(
        slugFromFeaturedHref(post.href),
        post.title,
        post.href,
        post.categorySlug,
      );
    },
    [explore],
  );

  const rotationBucket = useRotationTimeBucket(initialRotationBucket, ROTATION_INTERVAL_MS);

  const toggleTag = useCallback((tag: BlogIntentTagId) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSearch('');
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [selectedCategory, selectedTags, search]);

  const metaBySlug = useMemo(
    () => new Map(articlesTagMeta.map((m) => [m.slug, m])),
    [articlesTagMeta],
  );

  const filteredFeaturedPool = useMemo(
    () =>
      filterFeaturedPosts(FEATURED_POSTS, metaBySlug, {
        categorySlug: selectedCategory,
        selectedTags,
        search,
      }),
    [metaBySlug, selectedCategory, selectedTags, search],
  );

  /** Reinicia paginação de "Continue aprendendo" quando categoria, objetivos ou busca mudam. */
  const continueLearningFilterKey = useMemo(
    () => `${selectedCategory ?? ''}|${[...selectedTags].sort().join(',')}|${search}`,
    [selectedCategory, selectedTags, search],
  );

  const featuredVisible = useMemo(
    () =>
      showAll
        ? sortFeaturedPostsByDateDesc(filteredFeaturedPool)
        : pickRotatedFeaturedPosts(filteredFeaturedPool, rotationBucket),
    [filteredFeaturedPool, showAll, rotationBucket],
  );

  return (
    <div className="space-y-16 md:space-y-20 lg:space-y-24">
      {devAuditIssues && devAuditIssues.length > 0 ? <BlogDevAuditBanner issues={devAuditIssues} /> : null}
      <div className="space-y-8 lg:space-y-10">
        <BlogHero />
        <div id="toolbar" className="scroll-mt-24 space-y-6">
          <BlogToolbar
            search={search}
            onSearchChange={setSearch}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onResetFilters={clearFilters}
          />
        </div>
      </div>
      <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        <div className="min-w-0 flex-1 space-y-20">
          <BlogFeaturedSection
            posts={featuredVisible}
            totalFiltered={filteredFeaturedPool.length}
            showAllExpanded={showAll}
            onShowAll={() => setShowAll(true)}
            onShowLess={() => setShowAll(false)}
            onArticleNavigate={onArticleFromPost}
          />
          <BlogContinueLearningSection
            posts={filteredFeaturedPool}
            filterResetKey={continueLearningFilterKey}
            onArticleNavigate={onArticleFromPost}
          />
          <BlogGuidesSection />
        </div>
        <BlogSidebar
          selectedCategorySlug={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedIntentTags={selectedTags}
          onToggleIntentTag={toggleTag}
          initialPopularRotationBucket={initialPopularRotationBucket}
          categoryCounts={categoryCounts}
          featuredPostsCatalog={FEATURED_POSTS}
          metaBySlug={metaBySlug}
          exploreSnapshot={explore.snapshot}
          onRecordArticle={explore.recordArticle}
          registerCategoryUse={explore.registerCategoryUse}
          className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[300px] xl:w-[320px]"
        />
      </div>

      <BlogEvolucaoCtaSection />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        <BlogFaqSection />
        <BlogToolsCtaSection />
      </div>
    </div>
  );
}
