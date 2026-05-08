/** Classes CTAs do hero igual à página principal — use com `<Button size="lg" className={...} />`. */

export const HERO_CTA_STACK =
  'flex w-full max-w-lg flex-col gap-3 pt-1 sm:flex-row sm:items-stretch sm:gap-3';

export const HERO_CTA_PRIMARY =
  'h-12 min-h-[48px] flex-1 gap-2 rounded-xl bg-[#0052FF] px-6 text-[15px] font-semibold text-white shadow-md shadow-blue-600/15 transition-all duration-200 ease-out hover:bg-[#0046e0] hover:shadow-lg hover:shadow-blue-600/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-initial sm:px-7';

/** outline + mesmo tamanho/raio/shadow da home */
export const HERO_CTA_SECONDARY =
  'h-12 min-h-[48px] flex-1 gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[15px] font-semibold text-[#1A1A1A] shadow-sm transition-all duration-200 ease-out hover:bg-[#F8F9FA] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/80 sm:flex-initial sm:px-7';

/**
 * CTA principal em banner horizontal no fim de páginas de ferramenta (ex.: Despertador).
 * Mesmo azul/tipografia do hero, com mais padding e peso para equilíbrio com o texto ao lado — sem flex-1 do stack.
 */
export const BANNER_CTA_PRIMARY =
  'inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0052FF] min-h-[3.25rem] px-8 py-3.5 text-[15px] font-semibold leading-none text-white shadow-md shadow-blue-600/18 ring-1 ring-blue-500/20 transition-all duration-200 ease-out hover:bg-[#0046e0] hover:shadow-lg hover:shadow-blue-600/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:shadow-md motion-reduce:active:scale-100';
