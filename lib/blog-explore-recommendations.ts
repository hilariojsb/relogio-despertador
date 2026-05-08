import type { FeaturedPost } from '@/components/blog-landing/data';
import type { HubArticleTagMeta } from '@/components/blog-landing/filter-featured-posts';
import { slugFromFeaturedHref } from '@/components/blog-landing/filter-featured-posts';
import type { ExploreLastArticle } from '@/lib/blog-explore-local-storage';

export type ExploreRecoContext = {
  posts: FeaturedPost[];
  metaBySlug: Map<string, HubArticleTagMeta>;
  selectedCategorySlug: string | null;
  selectedIntentTags: string[];
  lastArticle: ExploreLastArticle | null;
  lastCategorySlug: string | null;
};

function bySlug(posts: FeaturedPost[]): Map<string, FeaturedPost> {
  const m = new Map<string, FeaturedPost>();
  for (const p of posts) {
    m.set(slugFromFeaturedHref(p.href), p);
  }
  return m;
}

/** Card único do último artigo aberto (se existir no hub). */
export function pickContinueReading(posts: FeaturedPost[], last: ExploreLastArticle | null): FeaturedPost[] {
  if (!last) return [];
  const p = bySlug(posts).get(last.slug);
  return p ? [p] : [];
}

/** Relaciona filtros ativos + última categoria do histórico. */
export function pickSuggestionsForYou(ctx: ExploreRecoContext, limit = 4): FeaturedPost[] {
  const continueSlug = ctx.lastArticle?.slug;
  const hide = new Set<string>();
  if (continueSlug) hide.add(continueSlug);

  const scored = ctx.posts.map((p) => {
    const slug = slugFromFeaturedHref(p.href);
    if (hide.has(slug)) return { p, score: -1 };
    const meta = ctx.metaBySlug.get(slug);
    let score = 0;
    if (ctx.selectedCategorySlug && p.categorySlug === ctx.selectedCategorySlug) score += 14;
    if (ctx.selectedIntentTags.length > 0 && meta?.tags?.length) {
      const hits = ctx.selectedIntentTags.filter((t) => meta.tags!.includes(t)).length;
      score += hits * 9;
    }
    if (!ctx.selectedCategorySlug && ctx.lastCategorySlug && p.categorySlug === ctx.lastCategorySlug) {
      score += 8;
    }
    return { p, score };
  });

  const positive = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const neutral = scored.filter((s) => s.score === 0 && !hide.has(slugFromFeaturedHref(s.p.href)));

  const ordered =
    positive.length > 0 ? positive : [...neutral].sort((a, b) => a.p.title.localeCompare(b.p.title, 'pt-BR'));

  const out: FeaturedPost[] = [];
  const seen = new Set<string>();
  for (const { p } of ordered) {
    const slug = slugFromFeaturedHref(p.href);
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

const JOURNEY_BY_FOCUS: Record<string, string[]> = {
  produtividade: [
    'habitos-produtivos',
    'criar-rotina-diaria',
    'como-manter-consistencia',
    'rotina-matinal-ideal',
  ],
  rotina: [
    'criar-rotina-diaria',
    'como-manter-consistencia',
    'rotina-matinal-ideal',
    'habitos-produtivos',
  ],
  estudos: [
    'como-estudar-com-foco',
    'como-revisar-conteudo',
    'como-memorizar-mais-rapido',
    'tecnicas-de-estudo-que-funcionam',
  ],
  foco: ['pomodoro', 'intervalo-ideal-estudo', 'como-estudar-com-foco', 'intervalo-10-minutos'],
  habito: ['lembretes-5-minutos', 'habitos-produtivos', 'criar-rotina-diaria', 'como-manter-consistencia'],
  organizacao: [
    'disciplina-planejamento',
    'como-manter-consistencia',
    'quanto-tempo-estudar-por-dia',
    'criar-rotina-diaria',
  ],
};

function inferFocus(ctx: ExploreRecoContext): string {
  if (ctx.selectedCategorySlug && JOURNEY_BY_FOCUS[ctx.selectedCategorySlug]) {
    return ctx.selectedCategorySlug;
  }
  const la = ctx.lastArticle?.slug;
  if (la) {
    const p = ctx.posts.find((x) => slugFromFeaturedHref(x.href) === la);
    if (p && JOURNEY_BY_FOCUS[p.categorySlug]) return p.categorySlug;
  }
  if (ctx.lastCategorySlug && JOURNEY_BY_FOCUS[ctx.lastCategorySlug]) return ctx.lastCategorySlug;
  if (ctx.selectedIntentTags.includes('estudos')) return 'estudos';
  if (ctx.selectedIntentTags.includes('rotina')) return 'rotina';
  if (ctx.selectedIntentTags.includes('foco')) return 'produtividade';
  if (ctx.selectedIntentTags.includes('procrastinacao')) return 'produtividade';
  return 'produtividade';
}

export function pickNextStep(ctx: ExploreRecoContext, limit = 4, excludeSlugs?: Set<string>): FeaturedPost[] {
  const map = bySlug(ctx.posts);
  const exclude = new Set(excludeSlugs ?? []);
  const cont = pickContinueReading(ctx.posts, ctx.lastArticle);
  for (const p of cont) exclude.add(slugFromFeaturedHref(p.href));
  const recent = ctx.lastArticle?.slug;
  if (recent) exclude.add(recent);

  const focus = inferFocus(ctx);
  const chain = JOURNEY_BY_FOCUS[focus] ?? JOURNEY_BY_FOCUS.produtividade;
  const out: FeaturedPost[] = [];

  for (const slug of chain) {
    if (out.length >= limit) break;
    if (exclude.has(slug)) continue;
    const p = map.get(slug);
    if (p) out.push(p);
  }

  if (out.length < limit) {
    for (const p of ctx.posts) {
      if (out.length >= limit) break;
      const slug = slugFromFeaturedHref(p.href);
      if (exclude.has(slug) || p.categorySlug !== focus) continue;
      if (out.some((x) => slugFromFeaturedHref(x.href) === slug)) continue;
      out.push(p);
    }
  }

  return out.slice(0, limit);
}

/** Ordena categorias por frequência de clique (local), depois nome. */
export function sortCategoriesByAffinity<T extends { slug: string; label: string }>(
  rows: T[],
  clicks: Record<string, number>,
): T[] {
  return [...rows].sort((a, b) => {
    const ca = clicks[a.slug] ?? 0;
    const cb = clicks[b.slug] ?? 0;
    if (cb !== ca) return cb - ca;
    return a.label.localeCompare(b.label, 'pt-BR');
  });
}
