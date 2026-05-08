import Link from 'next/link';
import { AlarmClock, ChevronRight, Hourglass, Timer } from 'lucide-react';

const INTENT_CHOICES = [
  {
    intent: 'Focar',
    microcopy: 'Blocos de trabalho com pausas na medida para manter ritmo sem esgotar.',
    href: '/pomodoro',
    toolLabel: 'Pomodoro',
    icon: 'pomodoro' as const,
  },
  {
    intent: 'Acordar',
    microcopy: 'Alarmes nomeados e som ajustável quando o ponto de partida é um horário.',
    href: '/despertador',
    toolLabel: 'Despertador',
    icon: 'alarm' as const,
  },
  {
    intent: 'Medir tempo',
    microcopy: 'Cronometrar duração real de tarefas, estudo ou treino com precisão.',
    href: '/cronometro',
    toolLabel: 'Cronômetro',
    icon: 'stopwatch' as const,
  },
  {
    intent: 'Organizar pausas',
    microcopy: 'Contagem regressiva para descanso, cozinha ou intervalo entre blocos.',
    href: '/temporizador',
    toolLabel: 'Temporizador',
    icon: 'timer' as const,
  },
];

function ChoiceIcon({ kind }: { kind: (typeof INTENT_CHOICES)[number]['icon'] }) {
  const shell = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10';
  const c = 'h-[22px] w-[22px] text-[#2563eb]';
  switch (kind) {
    case 'pomodoro':
      return (
        <span className={shell} aria-hidden>
          <span className="text-xl leading-none">🍅</span>
        </span>
      );
    case 'alarm':
      return (
        <span className={shell} aria-hidden>
          <AlarmClock className={c} strokeWidth={2} />
        </span>
      );
    case 'stopwatch':
      return (
        <span className={shell} aria-hidden>
          <Timer className={c} strokeWidth={2} />
        </span>
      );
    case 'timer':
      return (
        <span className={shell} aria-hidden>
          <Hourglass className={c} strokeWidth={2} />
        </span>
      );
    default:
      return null;
  }
}

export function BlogToolsCtaSection() {
  return (
    <section
      id="ferramentas-por-intencao"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40 sm:p-8"
      style={{ borderRadius: '16px' }}
      aria-labelledby="tools-cta-heading"
    >
      <h2
        id="tools-cta-heading"
        className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
      >
        O que você quer fazer?
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-[#64748b] sm:text-[15px] dark:text-slate-400">
        Escolha pela intenção — cada opção abre a ferramenta pensada para esse tipo de uso, sem lista genérica para
        decorar.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {INTENT_CHOICES.map((row) => (
          <li key={row.href}>
            <Link
              href={row.href}
              className="group flex min-h-[92px] gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4 transition-all duration-200 hover:border-slate-200 hover:bg-[#f9fafb] dark:border-slate-700/50 dark:bg-slate-800/30 dark:hover:border-slate-600 dark:hover:bg-slate-800/60"
            >
              <ChoiceIcon kind={row.icon} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">{row.intent}</p>
                  <span className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-[#2563eb] dark:text-blue-400">
                    {row.toolLabel}
                    <ChevronRight
                      className="h-4 w-4 opacity-50 transition duration-200 group-hover:translate-x-px group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>
                </div>
                <p className="text-left text-[12px] leading-snug text-[#6b7280] dark:text-slate-400">{row.microcopy}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/#t-ferramentas"
        className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#2563eb] text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600"
      >
        Escolher ferramenta ideal
        <span className="ml-1 opacity-95" aria-hidden>
          →
        </span>
      </Link>
    </section>
  );
}
