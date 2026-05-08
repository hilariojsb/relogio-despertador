import Link from 'next/link';
import {
  AlarmClock,
  ChevronRight,
  Clock,
  Globe,
  Hourglass,
  Timer,
  Watch,
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import type { BlogArticle } from '@/lib/blog-articles/types';
import { cn } from '@/lib/utils';

const toolLinks = [
  { href: '/pomodoro', label: 'Pomodoro', description: 'Ciclos 25/5', Icon: Timer },
  { href: '/despertador', label: 'Despertador', description: 'Alarmes nomeados', Icon: AlarmClock },
  { href: '/temporizador', label: 'Temporizador', description: 'Contagem regressiva', Icon: Hourglass },
  { href: '/cronometro', label: 'Cronômetro', description: 'Medir tempo', Icon: Watch },
  { href: '/', label: 'Relógio online', description: 'Hora atual', Icon: Clock },
  { href: '/hora-mundial', label: 'Hora mundial', description: 'Fusos e cidades', Icon: Globe },
] as const;

function articleFormatLabel(readMinutes: number): 'Leitura rápida' | 'Guia prático' {
  return readMinutes <= 10 ? 'Leitura rápida' : 'Guia prático';
}

type BlogArticleSidebarProps = {
  current: BlogArticle;
  related: BlogArticle[];
  className?: string;
};

/**
 * Painel lateral do artigo: atalhos de ferramentas e leituras relacionadas.
 */
export function BlogArticleSidebar({ current, related, className }: BlogArticleSidebarProps) {
  return (
    <aside
      className={cn('min-w-0 shrink-0 space-y-8 xl:w-[300px]', className)}
      aria-label="Ferramentas e artigos relacionados"
    >
      {/* Ferramentas */}
      <nav
        className={cn(
          'rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm',
          'dark:border-slate-700/70 dark:bg-slate-900/60 dark:shadow-none'
        )}
        aria-label="Atalhos de ferramentas"
        id={`tools-${current.slug}`}
      >
        <h2 className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-800 dark:text-slate-100">
          Ferramentas
        </h2>
        <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
          Acesso rápido — um clique para abrir no mesmo separador.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          {toolLinks.map(({ href, label, description, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3 py-2.5 text-left transition-all duration-200 ease-out',
                  'hover:scale-105 hover:border-indigo-300/80 hover:bg-white hover:shadow-md',
                  'dark:border-slate-600/80 dark:bg-slate-800/50 dark:hover:border-indigo-500/35 dark:hover:bg-slate-800',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/90 transition-colors duration-200',
                    'group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:ring-indigo-200/80',
                    'dark:bg-slate-900 dark:text-indigo-400 dark:ring-slate-600 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-300'
                  )}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</span>
                  <span className="block text-[11px] text-slate-500 transition-colors duration-200 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300">
                    {description}
                  </span>
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-500"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Relacionados */}
      {related.length > 0 && (
        <nav
          className={cn(
            'rounded-2xl border border-slate-200/90 bg-slate-50/90 p-4 shadow-sm',
            'dark:border-slate-700/70 dark:bg-slate-900/40 dark:shadow-none'
          )}
          aria-labelledby={`related-${current.slug}`}
          id={`related-${current.slug}`}
        >
          <h2
            id={`related-${current.slug}`}
            className="text-[13px] font-bold uppercase tracking-[0.06em] text-slate-800 dark:text-slate-100"
          >
            Continue lendo
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Escolha o próximo passo na sua rotina.</p>
          <ul className="mt-5 flex flex-col gap-3.5">
            {related.map((a, index) => {
              const formatLabel = articleFormatLabel(a.readMinutes);
              const isFeatured = index === 0;
              return (
                <li key={a.slug}>
                  <Link
                    href={`/blog/${a.slug}`}
                    className={cn(
                      'group block rounded-xl border p-3.5 transition-all duration-200 ease-out',
                      isFeatured
                        ? 'border-indigo-200/90 bg-white shadow-sm ring-1 ring-indigo-500/[0.08] hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-md dark:border-indigo-500/30 dark:bg-slate-900/70 dark:ring-indigo-400/15 dark:hover:border-indigo-400/50 dark:hover:bg-indigo-950/25'
                        : 'border-slate-200/90 bg-white/90 hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-slate-600/70 dark:bg-slate-900/55 dark:hover:border-slate-500 dark:hover:bg-slate-800/80',
                      'hover:scale-[1.02]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950'
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {isFeatured ? (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-indigo-500">
                          Recomendado
                        </span>
                      ) : null}
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1',
                          formatLabel === 'Leitura rápida'
                            ? 'bg-emerald-50 text-emerald-800 ring-emerald-600/15 dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-500/25'
                            : 'bg-blue-50 text-blue-800 ring-blue-600/15 dark:bg-blue-950/45 dark:text-blue-200 dark:ring-blue-500/25'
                        )}
                      >
                        {formatLabel}
                      </span>
                      <span className="text-[10px] font-medium tabular-nums text-slate-400 dark:text-slate-500">
                        ~{a.readMinutes} min
                      </span>
                    </div>
                    <span className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                      {a.title}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-90 transition-all duration-200 group-hover:gap-1.5 dark:text-indigo-400">
                      Abrir artigo
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Publicidade */}
      <div
        className={cn(
          'rounded-2xl border border-dashed border-slate-300/90 bg-white/60 p-3 dark:border-slate-600 dark:bg-slate-900/30'
        )}
      >
        <p className="sr-only">Área reservada para publicidade</p>
        <AdBanner slot="middle" className="min-h-[200px] w-full rounded-xl bg-slate-50/80 dark:bg-slate-800/40" />
      </div>

      <Link
        href="/blog"
        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        ← Índice do blog
      </Link>
    </aside>
  );
}
