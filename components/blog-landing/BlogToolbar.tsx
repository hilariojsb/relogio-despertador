'use client';

import { Search } from 'lucide-react';
import { CATEGORY_CHIPS } from '@/components/blog-landing/data';
import { cn } from '@/lib/utils';

type BlogToolbarProps = {
  search: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  onResetFilters: () => void;
};

export function BlogToolbar({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onResetFilters,
}: BlogToolbarProps) {
  return (
    <section
      className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:gap-5 sm:p-5 dark:border-slate-700/60 dark:bg-slate-900/40"
      aria-label="Buscar e filtrar artigos"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="relative min-w-0 flex-1 sm:max-w-xl lg:max-w-[440px]">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#64748b]"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar artigos..."
            className="h-12 w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-5 text-[14px] text-[#0f172a] shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-[#2563eb]/35 focus:ring-2 focus:ring-[#2563eb]/15 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 sm:gap-3">
          <div>
            <span className="block text-[13px] font-semibold uppercase tracking-wide text-[#334155] dark:text-slate-300">
              Categorias
            </span>
            <p className="mt-1 max-w-md text-[13px] leading-snug text-[#64748b] dark:text-slate-400">
              Combine com busca e com os objetivos na barra lateral — os filtros ativos aplicam juntos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {CATEGORY_CHIPS.map(({ label, slug }) => (
              <button
                key={slug}
                type="button"
                onClick={() => onCategoryChange(selectedCategory === slug ? null : slug)}
                className={cn(
                  'inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3.5 text-[13px] font-medium leading-none text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:px-4 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800',
                  selectedCategory === slug &&
                    'border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-sm dark:bg-blue-950/50 dark:text-blue-300',
                )}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3.5 text-[13px] font-medium leading-none text-slate-600 transition-colors hover:bg-slate-50 sm:px-4 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
