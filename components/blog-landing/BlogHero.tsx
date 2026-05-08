import Image from 'next/image';
import type { ReactNode } from 'react';
import { Bell, BookOpen, Check } from 'lucide-react';

const BULLETS = [
  { Icon: Check, line1: 'Conteúdo 100%', line2: 'prático e útil' },
  { Icon: BookOpen, line1: 'Guias completos', line2: 'passo a passo' },
  { Icon: Bell, line1: 'Atualizações', line2: 'frequentes' },
] as const;

type BlogHeroProps = {
  /** Navegação guiada logo após o parágrafo introdutório (ex.: ações rápidas). */
  belowDescription?: ReactNode;
};

export function BlogHero({ belowDescription }: BlogHeroProps) {
  return (
    <section
      className="grid grid-cols-1 items-center gap-10 py-6 sm:gap-12 lg:grid-cols-2 lg:gap-14 lg:py-10 xl:gap-16"
      aria-labelledby="blog-hero-title"
    >
      <div className="min-w-0 space-y-5 lg:space-y-6">
        <p className="text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-[#2563eb] sm:text-xs sm:tracking-[0.16em]">
          BLOG
        </p>
        <h1
          id="blog-hero-title"
          className="text-pretty text-[1.75rem] font-bold leading-[1.2] tracking-[-0.02em] text-[#0f172a] sm:text-[2rem] sm:leading-[1.18] lg:text-[2.375rem] lg:leading-[1.15] dark:text-white"
        >
          <span className="block">Dicas e guias para</span>
          <span className="block">melhor gerenciar seu tempo</span>
        </h1>
        <p className="max-w-xl text-[15px] leading-[1.65] text-[#64748b] sm:text-base sm:leading-[1.7]">
          <span className="block">
            Conteúdos práticos sobre produtividade, gestão de tempo, Pomodoro, despertador online e hábitos.
          </span>
          <span className="block">
            Use o hub abaixo para buscar, filtrar por objetivo e ir direto ao que importa para o seu dia.
          </span>
        </p>
        {belowDescription ? <div className="mt-4 space-y-0">{belowDescription}</div> : null}
        <ul className="flex flex-col gap-5 pt-1 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-8 sm:gap-y-4 lg:gap-x-10">
          {BULLETS.map(({ Icon, line1, line2 }) => (
            <li key={line1} className="flex items-center gap-3.5">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb] ring-1 ring-[#2563eb]/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-500/20"
                aria-hidden
              >
                <Icon className="h-6 w-6" strokeWidth={2.25} />
              </span>
              <span className="text-[14px] font-medium leading-tight text-[#0f172a] dark:text-slate-100">
                <span className="block">{line1}</span>
                <span className="block">{line2}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:max-w-none">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18),0_12px_32px_-12px_rgba(15,23,42,0.1)] ring-1 ring-slate-200/50 dark:bg-slate-800/90 dark:ring-slate-600/40 sm:rounded-[32px]">
          <Image
            src="https://res.cloudinary.com/dtqplznus/image/upload/v1777891721/ChatGPT_Image_4_de_mai._de_2026_07_45_16_pgpkez.png"
            alt="Mesa de trabalho com laptop aberto mostrando o site Relógio Despertador, café, caderno e livros sobre produtividade"
            width={1600}
            height={1067}
            className="aspect-[1600/1067] h-auto w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
