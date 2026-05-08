'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import type { FeaturedPost } from '@/components/blog-landing/data';
import { POPULAR_POSTS } from '@/components/blog-landing/data';
import type { HubArticleTagMeta } from '@/components/blog-landing/filter-featured-posts';
import { slugFromFeaturedHref } from '@/components/blog-landing/filter-featured-posts';
import {
  pickRotatedPopularPosts,
  POPULAR_ROTATION_INTERVAL_MS,
} from '@/components/blog-landing/popular-rotation';
import { useRotationTimeBucket } from '@/hooks/useRotationTimeBucket';
import { BLOG_INTENT_GOALS, type BlogIntentTagId } from '@/lib/blog-articles/blog-intent-tags';
import type { ExploreLocalSnapshot } from '@/lib/blog-explore-local-storage';
import {
  pickContinueReading,
  pickNextStep,
  pickSuggestionsForYou,
  sortCategoriesByAffinity,
} from '@/lib/blog-explore-recommendations';
import { cn } from '@/lib/utils';
import type { BlogCategoryCountRow } from '@/lib/blog-articles';

/** Faixa sutil atrás dos rótulos Categorias / Objetivos */
function ExploreSectionHeader({ label, withTopGap }: { label: string; withTopGap?: boolean }) {
  return (
    <div
      className={cn(
        'mb-2 rounded-[6px] bg-[#f5f6f8] py-1.5 px-[10px] dark:bg-slate-800/45',
        withTopGap ? 'mt-3' : undefined,
      )}
    >
      <span className="block text-[12px] font-semibold uppercase leading-none tracking-[0.055em] text-slate-600 dark:text-slate-400">
        {label}
      </span>
    </div>
  );
}

const INNER_BLOCK_TITLE =
  'block text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-slate-500/90 dark:text-slate-400/85 mb-2.5';

const recoCardInner = 'rounded-xl border border-slate-100/90 bg-slate-50/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/25';

/** Linha clicável (categoria ou objetivo): padding 8×10px, raio 6px, hover e ativo alinhados aos chips. */
function exploreRowClasses(selected: boolean) {
  return cn(
    'group relative flex w-full cursor-pointer items-center justify-between rounded-[6px] px-[10px] py-2 text-left text-sm outline-none transition-[background-color,border-color,color,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[#2563eb]/25 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
    selected
      ? 'border border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
      : 'border border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70',
  );
}

function mostPopularSlug(rows: BlogCategoryCountRow[]): string | null {
  if (rows.length === 0) return null;
  const sorted = [...rows].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'),
  );
  return sorted[0]!.slug;
}

const ExploreSmartLink = memo(function ExploreSmartLink({
  post,
  onRecordReading,
}: {
  post: FeaturedPost;
  onRecordReading: (slug: string, title: string, href: string, categorySlug: string | null) => void;
}) {
  const slug = slugFromFeaturedHref(post.href);
  return (
    <Link
      href={post.href}
      title={post.title}
      className="group flex min-h-[3.25rem] items-start gap-2.5 rounded-lg outline-none transition-colors hover:bg-white/80 dark:hover:bg-white/[0.06]"
      onClick={() => onRecordReading(slug, post.title, post.href, post.categorySlug)}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200/80 dark:ring-slate-600">
        <Image src={post.image} alt="" width={48} height={48} className="h-full w-full object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900 group-hover:text-[#2563eb] dark:text-white dark:group-hover:text-blue-400">
          {post.title}
        </span>
        <span className="text-[11px] text-[#64748b]">{post.readMin} min</span>
      </span>
    </Link>
  );
});

export function BlogSidebar({
  className,
  categoryCounts,
  initialPopularRotationBucket,
  selectedCategorySlug,
  onCategoryChange,
  selectedIntentTags,
  onToggleIntentTag,
  featuredPostsCatalog,
  metaBySlug,
  exploreSnapshot,
  onRecordArticle,
  registerCategoryUse,
}: {
  className?: string;
  categoryCounts: BlogCategoryCountRow[];
  initialPopularRotationBucket: number;
  selectedCategorySlug: string | null;
  onCategoryChange: (slug: string | null) => void;
  selectedIntentTags: string[];
  onToggleIntentTag: (tag: BlogIntentTagId) => void;
  featuredPostsCatalog: FeaturedPost[];
  metaBySlug: Map<string, HubArticleTagMeta>;
  exploreSnapshot: ExploreLocalSnapshot;
  onRecordArticle: (slug: string, title: string, href: string, categorySlug: string | null) => void;
  registerCategoryUse: (categorySlug: string) => void;
}) {
  const [email, setEmail] = useState('');
  const popularBucket = useRotationTimeBucket(
    initialPopularRotationBucket,
    POPULAR_ROTATION_INTERVAL_MS,
  );

  const popularVisible = useMemo(
    () => pickRotatedPopularPosts(POPULAR_POSTS, popularBucket),
    [popularBucket],
  );

  const topSlug = useMemo(() => mostPopularSlug(categoryCounts), [categoryCounts]);

  const sortedCategoryCounts = useMemo(
    () => sortCategoriesByAffinity(categoryCounts, exploreSnapshot.categoryClicks),
    [categoryCounts, exploreSnapshot.categoryClicks],
  );

  const exploringLabel = useMemo(() => {
    const bits: string[] = [];
    if (selectedCategorySlug) {
      const row = categoryCounts.find((c) => c.slug === selectedCategorySlug);
      if (row) bits.push(row.label);
    }
    for (const id of selectedIntentTags) {
      const g = BLOG_INTENT_GOALS.find((x) => x.tagId === id);
      if (g) bits.push(g.title);
    }
    if (bits.length === 0) return null;
    return bits.join(' · ');
  }, [selectedCategorySlug, selectedIntentTags, categoryCounts]);

  const recoCtx = useMemo(
    () => ({
      posts: featuredPostsCatalog,
      metaBySlug,
      selectedCategorySlug,
      selectedIntentTags,
      lastArticle: exploreSnapshot.lastArticle,
      lastCategorySlug: exploreSnapshot.lastCategorySlug,
    }),
    [
      featuredPostsCatalog,
      metaBySlug,
      selectedCategorySlug,
      selectedIntentTags,
      exploreSnapshot.lastArticle,
      exploreSnapshot.lastCategorySlug,
    ],
  );

  const { continuePosts, suggestionPosts, nextStepPosts } = useMemo(() => {
    const cont = pickContinueReading(featuredPostsCatalog, exploreSnapshot.lastArticle);
    const sug = pickSuggestionsForYou(recoCtx, 4);
    const hideNext = new Set<string>();
    for (const p of cont) hideNext.add(slugFromFeaturedHref(p.href));
    for (const p of sug) hideNext.add(slugFromFeaturedHref(p.href));
    const next = pickNextStep(recoCtx, 4, hideNext);
    return { continuePosts: cont, suggestionPosts: sug, nextStepPosts: next };
  }, [recoCtx, featuredPostsCatalog]);

  const selectCategory = (slug: string) => {
    const next = selectedCategorySlug === slug ? null : slug;
    if (next) registerCategoryUse(next);
    onCategoryChange(next);
  };

  return (
    <aside className={`space-y-6 ${className ?? ''}`}>
      <nav
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40"
        style={{ borderRadius: '14px' }}
        aria-label="Explorar por tema, categoria e objetivo"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Explore por tema</h2>
        <p className="mt-3 text-[13px] leading-snug text-[#64748b] dark:text-slate-400">
          Escolha um tema ou objetivo — sugestões mudam conforme o que você filtra e lê.
        </p>

        {exploringLabel ? (
          <p
            className="mt-4 rounded-lg border border-blue-200/60 bg-blue-50/95 px-3 py-2.5 text-[13px] leading-snug text-blue-950 dark:border-blue-800/50 dark:bg-blue-950/35 dark:text-blue-100"
            role="status"
          >
            <span className="font-semibold text-blue-800 dark:text-blue-200">Você está explorando:</span>{' '}
            <span className="text-blue-900/95 dark:text-blue-50/95">{exploringLabel}</span>
          </p>
        ) : null}

        {continuePosts.length > 0 ? (
          <div className="mt-5">
            <span className={INNER_BLOCK_TITLE}>Continuar de onde parou</span>
            <div className={recoCardInner}>
              <ul className="flex flex-col gap-2">
                {continuePosts.map((p) => (
                  <li key={p.href}>
                    <ExploreSmartLink post={p} onRecordReading={onRecordArticle} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {suggestionPosts.length > 0 ? (
          <div className="mt-5">
            <span className={INNER_BLOCK_TITLE}>Sugestões para você</span>
            <div className={recoCardInner}>
              <ul className="flex flex-col gap-2">
                {suggestionPosts.map((p) => (
                  <li key={p.href}>
                    <ExploreSmartLink post={p} onRecordReading={onRecordArticle} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {nextStepPosts.length > 0 ? (
          <div className="mt-5">
            <span className={INNER_BLOCK_TITLE}>Próximo passo</span>
            <div className={recoCardInner}>
              <ul className="flex flex-col gap-2">
                {nextStepPosts.map((p) => (
                  <li key={p.href}>
                    <ExploreSmartLink post={p} onRecordReading={onRecordArticle} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            'border-t border-slate-100 pt-5 dark:border-slate-700/70',
            continuePosts.length > 0 || suggestionPosts.length > 0 || nextStepPosts.length > 0 ? 'mt-5' : 'mt-6',
          )}
          aria-hidden
        />

        <ExploreSectionHeader label="Categorias" />
        <ul
          className="flex max-h-72 flex-col gap-[10px] overflow-y-auto overscroll-y-contain pr-0.5 scroll-smooth"
          role="list"
        >
          {sortedCategoryCounts.map(({ label, count, slug }) => {
            const selected = selectedCategorySlug === slug;
            const isTop = slug === topSlug && count > 0;
            const hint = `${label} — ${count} artigo${count === 1 ? '' : 's'} no hub. Clique para filtrar.`;
            return (
              <li key={slug}>
                <button
                  type="button"
                  aria-pressed={selected}
                  title={hint}
                  onClick={() => selectCategory(slug)}
                  className={exploreRowClasses(selected)}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <span className={cn('truncate leading-tight', isTop ? 'font-semibold' : 'font-normal')}>{label}</span>
                    {isTop ? (
                      <span className="inline-flex shrink-0 items-center rounded-full border border-blue-200/70 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#2563eb] dark:border-blue-500/30 dark:bg-blue-950/50 dark:text-blue-300">
                        Mais popular
                      </span>
                    ) : null}
                  </span>
                  <span
                    className="ml-2 shrink-0 tabular-nums text-sm text-[#64748b] opacity-55 dark:text-slate-400"
                    aria-label={`${count} artigos`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-1 border-t border-slate-100 pt-5 dark:border-slate-700/70" aria-hidden />

        <ExploreSectionHeader label="Objetivos" withTopGap />
        <ul className="flex flex-col gap-[10px]" role="list">
          {BLOG_INTENT_GOALS.map(({ title, body, tagId }) => {
            const selected = selectedIntentTags.includes(tagId);
            return (
              <li key={tagId}>
                <button
                  type="button"
                  aria-pressed={selected}
                  title={`${title}: ${body}`}
                  onClick={() => onToggleIntentTag(tagId)}
                  className={exploreRowClasses(selected)}
                >
                  <span className="min-w-0 flex-1 truncate leading-tight">{title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40"
        style={{ borderRadius: '14px' }}
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Mais populares</h2>
        <ul className="mt-4 space-y-3.5">
          {popularVisible.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                title={p.title}
                className="group flex min-h-[3.75rem] items-start gap-3 rounded-lg outline-none transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.04]"
                onClick={() => {
                  const slug = slugFromFeaturedHref(p.href);
                  const full = featuredPostsCatalog.find((x) => slugFromFeaturedHref(x.href) === slug);
                  onRecordArticle(slug, p.title, p.href, full?.categorySlug ?? null);
                }}
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80 dark:ring-slate-600">
                  <Image src={p.image} alt="" width={56} height={56} className="h-full w-full object-cover" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
                  <p className="line-clamp-2 min-h-[2.8em] text-[0.9rem] font-semibold leading-[1.4] text-slate-900 group-hover:text-[#2563eb] dark:text-white dark:group-hover:text-blue-400">
                    {p.title}
                  </p>
                  <p className="shrink-0 text-xs leading-normal text-[#64748b]">{p.readMin} min de leitura</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="rounded-2xl bg-[#2563eb] p-5 text-white shadow-md"
        style={{ borderRadius: '14px' }}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold">Receba novos artigos</h2>
            <p className="mt-1 text-sm leading-relaxed text-blue-100">
              Resumo ocasional com dicas e novidades. Sem spam.
            </p>
          </div>
        </div>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setEmail('');
          }}
        >
          <label htmlFor="blog-newsletter-email" className="sr-only">
            Seu melhor e-mail
          </label>
          <input
            id="blog-newsletter-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            className="h-11 w-full rounded-lg border-0 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-white text-sm font-semibold text-[#2563eb] shadow-sm transition hover:bg-blue-50"
          >
            Assinar newsletter
          </button>
        </form>
      </div>
    </aside>
  );
}
