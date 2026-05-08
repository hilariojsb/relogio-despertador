'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookMarked, ChevronRight } from 'lucide-react';
import type { FeaturedPost } from '@/components/blog-landing/data';

const ITEMS_PER_PAGE = 10;

type BlogContinueLearningSectionProps = {
  /** Lista já filtrada por intenção, categoria e busca (mesma lógica dos cards em destaque). */
  posts: FeaturedPost[];
  /** Muda quando categoria/tags/busca mudam — reinicia para a primeira página. */
  filterResetKey?: string;
  onArticleNavigate?: (post: FeaturedPost) => void;
};

/** Links internos para leitura em sequência — respeita filtros ativos na landing. */
export function BlogContinueLearningSection({
  posts,
  filterResetKey = '',
  onArticleNavigate,
}: BlogContinueLearningSectionProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [filterResetKey]);

  const lastPageIndex = useMemo(
    () => Math.max(0, Math.ceil(posts.length / ITEMS_PER_PAGE) - 1),
    [posts.length],
  );

  useEffect(() => {
    setPage((p) => Math.min(p, lastPageIndex));
  }, [lastPageIndex]);

  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const visibleArticles = posts.slice(start, end);

  const hasPagination = posts.length > ITEMS_PER_PAGE;
  const totalPages = lastPageIndex + 1;
  const disablePrev = page === 0;
  const disableNext = end >= posts.length;

  return (
    <section
      id="continue-aprendendo"
      className="scroll-mt-24 space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40 sm:p-8"
      style={{ borderRadius: '14px' }}
      aria-labelledby="continue-learning-heading"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
          <BookMarked className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2
            id="continue-learning-heading"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
          >
            Continue aprendendo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b] sm:text-base">
            Aprofunde com outros guias do blog — cada link leva a uma leitura completa, pronta para colocar em
            prática com as ferramentas do site.
          </p>
        </div>
      </div>
      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-[#64748b] dark:border-slate-600 dark:text-slate-400">
          Nenhum artigo encontrado para os filtros selecionados. Limpe o filtro ou ajuste a busca.
        </p>
      ) : (
        <>
          <div className="h-[500px] max-h-[500px] overflow-hidden rounded-xl border border-slate-200/60 bg-[#fafafa] dark:border-slate-700/70 dark:bg-slate-950/35">
            <ul
              key={page}
              className="animate-in fade-in slide-in-from-right-2 duration-300"
              aria-label={`Artigos, página ${page + 1} de ${totalPages}`}
              style={{
                animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {visibleArticles.map((p) => (
                <li
                  key={p.href}
                  className="border-b border-black/[0.05] last:border-b-0 dark:border-white/[0.06]"
                >
                  <Link
                    href={p.href}
                    className="group flex cursor-pointer items-center justify-between gap-4 px-4 py-[14px] transition-colors duration-200 hover:bg-[#f9fafb] dark:hover:bg-white/[0.05]"
                    onClick={() => onArticleNavigate?.(p)}
                  >
                    <div className="content flex min-w-0 flex-1 flex-col gap-1.5">
                      <h3 className="line-clamp-2 text-left text-[15px] font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-[#2563eb] dark:text-white dark:group-hover:text-blue-400">
                        {p.title}
                      </h3>
                      <span className="meta block text-left text-[12px] leading-snug text-[#6b7280] dark:text-slate-400">
                        Guia prático • {p.readMin} min de leitura
                      </span>
                    </div>
                    <ChevronRight
                      className="arrow h-[18px] w-[18px] shrink-0 text-slate-700 opacity-50 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-300"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasPagination ? (
            <nav
              className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4"
              aria-label="Paginação da lista de artigos"
            >
              <div className="flex w-full max-w-md items-center justify-between gap-4 sm:w-auto">
                <button
                  type="button"
                  disabled={disablePrev}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="min-w-[6.75rem] rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  ← Anterior
                </button>
                <span className="tabular-nums text-sm text-[#64748b] dark:text-slate-400">
                  Página {page + 1}
                  {totalPages > 1 ? (
                    <>
                      {' '}
                      <span aria-hidden>/</span> {totalPages}
                    </>
                  ) : null}
                </span>
                <button
                  type="button"
                  disabled={disableNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="min-w-[6.75rem] rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Próximo →
                </button>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
}
