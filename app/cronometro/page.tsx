import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Flag,
  Globe,
  Hourglass,
  Pause,
  Play,
  RefreshCcw,
  Shield,
  Smartphone,
  Zap,
} from 'lucide-react';
import AdBanner from '@/components/ads/AdBanner';
import { CronometroFaq } from '@/components/cronometro-landing/CronometroFaq';
import { CronometroStopwatchWidget } from '@/components/cronometro-landing/CronometroStopwatchWidget';

export const metadata: Metadata = {
  title: 'Cronômetro Online Grátis (Preciso e Fácil de Usar)',
  description:
    'Cronômetro online grátis com alta precisão. Ideal para treino, estudo e atividades do dia a dia. Simples e rápido de usar.',
};

const otherTools = [
  {
    href: '/despertador' as const,
    title: 'Despertador',
    desc: 'Crie alarmes personalizados com rótulos e volume.',
    header: 'bg-indigo-500',
    Icon: Bell,
  },
  {
    href: '/temporizador' as const,
    title: 'Temporizador',
    desc: 'Contagem regressiva para suas tarefas e atividades.',
    header: 'bg-blue-500',
    Icon: Hourglass,
  },
  {
    href: '/pomodoro' as const,
    title: 'Pomodoro',
    desc: 'Técnica Pomodoro para mais foco e produtividade.',
    header: 'bg-emerald-500',
    iconVariant: 'circle' as const,
  },
  {
    href: '/hora-mundial' as const,
    title: 'Hora Mundial',
    desc: 'Veja a hora atual em qualquer lugar do mundo.',
    header: 'bg-orange-500',
    Icon: Globe,
  },
] as const;

const comoUsarPassos = [
  {
    n: 1 as const,
    icon: Play,
    title: 'Inicie',
    body: 'Clique em "Iniciar" para começar a contagem.',
  },
  {
    n: 2 as const,
    icon: Flag,
    title: 'Marque voltas',
    body: 'Clique em "Volta" para registrar tempos intermediários.',
  },
  {
    n: 3 as const,
    icon: Pause,
    title: 'Pause',
    body: 'Clique em "Pausar" para interromper o cronômetro temporariamente.',
  },
  {
    n: 4 as const,
    icon: RefreshCcw,
    title: 'Zere',
    body: 'Clique em "Zerar" para reiniciar e começar novamente.',
  },
] as const;

export default function CronometroPage() {
  return (
    <div className="min-w-0 bg-[#F9FAFB] text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">CRONÔMETRO ONLINE</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
              Cronômetro <span className="text-[#2563EB]">online</span> grátis
            </h1>
            <p className="mt-4 max-w-[480px] text-base leading-relaxed text-[#4B5563]">
              Use nosso cronômetro online para medir o tempo com precisão. Ideal para estudos, treinos, tarefas e muito
              mais. Rápido, simples e 100% gratuito.
            </p>
            <ul className="mt-6 max-w-lg space-y-3">
              {(
                [
                  'Precisão de milissegundos',
                  'Interface simples e intuitiva',
                  'Funciona em segundo plano',
                  '100% online e gratuito',
                ] as const
              ).map(t => (
                <li key={t} className="flex items-start gap-3 text-sm text-gray-800">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563EB] shadow-sm"
                    aria-hidden
                  >
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                  </span>
                  <span className="leading-relaxed text-gray-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto mt-6 w-full min-w-0 max-w-full lg:mx-0 lg:mt-0 lg:flex lg:justify-end">
            <CronometroStopwatchWidget />
          </div>
        </section>

        <div className="mt-8">
          <AdBanner slot="top" />
        </div>
      </div>

      <div className="w-full bg-white">
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Como usar o cronômetro online
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base">
              É muito fácil medir o tempo com o nosso cronômetro.
            </p>
          </div>
          <div
            className="mt-8 flex flex-col items-center gap-6 md:flex-row md:flex-nowrap md:items-center md:justify-center md:gap-x-0 md:overflow-x-auto md:pb-1"
            role="list"
            aria-label="Passos do cronômetro"
          >
            {comoUsarPassos.map((s, i) => {
              const Icon = s.icon;
              const isPlay = s.n === 1;
              return (
                <Fragment key={s.n}>
                  <div
                    className="flex w-full max-w-[13.5rem] flex-col items-center gap-1 py-1 text-center sm:max-w-[15rem] md:w-48 md:max-w-none md:shrink-0 lg:w-52"
                    role="listitem"
                  >
                    <div className="relative mx-auto">
                      <span className="absolute -left-1 -top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-xs font-bold text-blue-600 shadow-sm">
                        {s.n}
                      </span>
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Icon
                          className={`h-12 w-12 ${isPlay ? 'fill-current' : ''}`}
                          strokeWidth={isPlay ? 0 : 2}
                          aria-hidden
                        />
                      </div>
                    </div>
                    <h3 className="mt-5 text-base font-extrabold text-gray-900">{s.title}</h3>
                    <p className="mt-3 max-w-[220px] text-pretty text-sm leading-relaxed text-gray-500 [text-wrap:balance]">
                      {s.body}
                    </p>
                  </div>
                  {i < comoUsarPassos.length - 1 && (
                    <div className="flex shrink-0 items-center justify-center text-gray-300 md:h-20 md:px-1 lg:px-2" aria-hidden>
                      <ChevronDown className="h-5 w-5 md:hidden" strokeWidth={1.75} />
                      <ChevronRight className="hidden h-5 w-5 md:block" strokeWidth={1.75} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-16">
        <AdBanner slot="middle" />

        <section>
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Por que usar nosso cronômetro?</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                {
                  title: 'Alta precisão',
                  body: 'Medição precisa até os milissegundos para resultados confiáveis.',
                  icon: Clock,
                  wrap: 'bg-sky-50 text-sky-600 ring-sky-100',
                },
                {
                  title: 'Leve e rápido',
                  body: 'Não consome recursos do seu dispositivo e funciona sem travar.',
                  icon: Zap,
                  wrap: 'bg-amber-50 text-amber-600 ring-amber-100',
                },
                {
                  title: 'Funciona em todos dispositivos',
                  body: 'Use no celular, tablet ou computador com total compatibilidade.',
                  icon: Smartphone,
                  wrap: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
                },
                {
                  title: 'Privacidade total',
                  body: 'Não coletamos seus dados. Seu tempo é seu e permanece privado.',
                  icon: Shield,
                  wrap: 'bg-violet-50 text-violet-600 ring-violet-100',
                },
              ] as const
            ).map(card => (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ring-1 ${card.wrap}`}
                >
                  <card.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-base font-bold text-gray-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="-mx-4 border-t border-b border-gray-200/30 bg-gray-50 px-4 py-16">
          <section>
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Mais ferramentas para você</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {otherTools.map(t => {
                  return (
                    <article
                      key={t.href}
                      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                    >
                      <div
                        className={`flex min-h-[3.5rem] items-center gap-2.5 p-4 ${t.header} text-white`}
                      >
                        <span className="shrink-0 text-white" aria-hidden>
                          {'iconVariant' in t ? (
                            <span className="block h-6 w-6 rounded-full border-2 border-white" />
                          ) : (
                            'Icon' in t && <t.Icon className="h-6 w-6" strokeWidth={2} />
                          )}
                        </span>
                        <h3 className="min-w-0 text-base font-bold leading-tight text-white">{t.title}</h3>
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                        <p className="text-sm leading-relaxed text-gray-600">{t.desc}</p>
                        <Link
                          href={t.href}
                          className="mt-5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                        >
                          Usar ferramenta →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-50 px-6 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  Ver todas as ferramentas
                </Link>
              </div>
          </section>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-8">
          <section className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Para que serve o cronômetro?</h2>
            <div className="mt-6 max-w-[500px]">
              <p className="text-base leading-relaxed text-gray-600">
                O cronômetro é uma ferramenta essencial para medir intervalos de tempo com precisão. É muito utilizado em
                atividades como:
              </p>
              <ul className="mt-6 space-y-2">
                {(
                  [
                    'Treinos e exercícios físicos',
                    'Estudos e provas',
                    'Cozinha e receitas',
                    'Jogos e competições',
                    'Trabalho e produtividade',
                  ] as const
                ).map(line => (
                  <li key={line} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Perguntas frequentes</h2>
            <div className="mt-6">
              <CronometroFaq />
            </div>
          </section>
        </div>

        <AdBanner slot="bottom" />
      </div>
    </div>
  );
}
