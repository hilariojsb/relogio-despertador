import Image from 'next/image';
import Link from 'next/link';
import type { FeaturedPost } from '@/components/blog-landing/data';
import { FEATURED_LIMIT } from '@/components/blog-landing/featured-rotation';
import { cn } from '@/lib/utils';

type BlogFeaturedSectionProps = {
  posts: FeaturedPost[];
  /** Total após filtros (cards disponíveis neste hub). */
  totalFiltered: number;
  showAllExpanded: boolean;
  onShowAll: () => void;
  onShowLess: () => void;
  onArticleNavigate?: (post: FeaturedPost) => void;
};

/** Cores alinhadas ao hub de destaques (produtividade / tempo / estudos). */
function categoryBadgeClass(categorySlug: string): string {
  switch (categorySlug) {
    case 'produtividade':
    case 'habito':
      return 'bg-[#8E44AD]';
    case 'rotina':
    case 'foco':
    case 'organizacao':
      return 'bg-[#2980B9]';
    case 'estudos':
      return 'bg-[#27AE60]';
    default:
      return 'bg-[#64748b]';
  }
}

export function BlogFeaturedSection({
  posts,
  totalFiltered,
  showAllExpanded,
  onShowAll,
  onShowLess,
  onArticleNavigate,
}: BlogFeaturedSectionProps) {
  const showExpandControls = totalFiltered > FEATURED_LIMIT;

  return (
    <section id="comece-aqui" className="space-y-8 scroll-mt-24" aria-labelledby="featured-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="featured-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
        >
          Artigos em destaque
        </h2>
        <div className="shrink-0 sm:text-right">
          {showExpandControls && !showAllExpanded ? (
            <button
              type="button"
              onClick={onShowAll}
              className="text-sm font-semibold text-[#2563eb] underline-offset-4 hover:underline"
            >
              Ver todos os destaques →
            </button>
          ) : showExpandControls && showAllExpanded ? (
            <button
              type="button"
              onClick={() => {
                onShowLess();
                document.getElementById('comece-aqui')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }}
              className="text-sm font-semibold text-[#2563eb] underline-offset-4 hover:underline"
            >
              Mostrar menos
            </button>
          ) : (
            <Link
              href="/blog#continue-aprendendo"
              className="text-sm font-semibold text-[#2563eb] underline-offset-4 hover:underline"
            >
              Ver todos os destaques →
            </Link>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-[#64748b] dark:border-slate-600 dark:bg-slate-900/30">
          Nenhum artigo encontrado para os filtros selecionados.
        </p>
      ) : (
        <ul
          key={showAllExpanded ? 'expanded' : 'collapsed'}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8"
        >
          {posts.map((post) => (
            <li key={post.href}>
              <article
                className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_18px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.06] transition-[box-shadow,transform] duration-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 dark:bg-slate-900/40 dark:ring-white/[0.08] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
              >
                <Link
                  href={post.href}
                  className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-slate-100"
                  onClick={() => onArticleNavigate?.(post)}
                >
                  <span
                    className={cn(
                      'absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm',
                      categoryBadgeClass(post.categorySlug),
                    )}
                  >
                    {post.category}
                  </span>
                  <Image
                    src={post.image}
                    alt=""
                    width={400}
                    height={250}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  <Link href={post.href} className="group/block" onClick={() => onArticleNavigate?.(post)}>
                    <h3 className="text-base font-bold leading-snug text-slate-950 group-hover/block:text-[#2563eb] dark:text-white dark:group-hover/block:text-blue-400">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[#64748b] dark:text-slate-400">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-xs text-[#94a3b8] dark:text-slate-500">
                    {post.readMin} min de leitura <span aria-hidden className="mx-1">•</span> {post.date}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
