'use client';

import { Fragment, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Pencil,
  Plus,
  Shield,
  Volume2,
} from 'lucide-react';
import { AlarmHubCard, type AlarmHubCardHandle } from '@/components/despertador-landing/AlarmHubCard';
import { tips } from '@/components/despertador-landing/despertador-content';
import { Button } from '@/components/ui/button';
import {
  TIMER_CONFIG,
  TIMER_PAGE_MINUTES,
  timerPagePath,
  type TimerPageMinutes,
} from '@/lib/constants/despertador-timer-pages';
import { HERO_CTA_PRIMARY, HERO_CTA_SECONDARY, HERO_CTA_STACK } from '@/lib/constants/hero-cta-button-classes';

const shell = 'mx-auto w-full min-w-0 max-w-6xl px-4';
const h2 = 'text-center text-[1.375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]';
const sub = 'mx-auto mt-3 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base';
const card =
  'rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:border-slate-200 hover:shadow-md hover:shadow-slate-900/5';

export function DespertadorBasePage({ tempo }: { tempo: TimerPageMinutes }) {
  const cfg = TIMER_CONFIG[tempo];
  const hubRef = useRef<AlarmHubCardHandle>(null);
  const heroSectionId = `timer-hero-${tempo}`;

  const startNow = () => {
    hubRef.current?.addQuickMinutes(tempo);
    const el =
      document.getElementById('bloco-adicionar-alarme') ??
      document.querySelector('[aria-label="Lista de alarmes"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const openPreset = () => {
    hubRef.current?.presetFormMinutes(tempo, cfg.title);
    document.getElementById('bloco-adicionar-alarme')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const whyIcon = (key: 'bell' | 'clock' | 'speaker' | 'shield') => {
    const cls = 'h-5 w-5 sm:h-6 sm:w-6 text-[#2563EB]';
    switch (key) {
      case 'bell':
        return <Bell className={cls} strokeWidth={1.75} />;
      case 'clock':
        return <Clock className={cls} strokeWidth={1.75} />;
      case 'speaker':
        return <Volume2 className={cls} strokeWidth={1.75} />;
      default:
        return <Shield className={cls} strokeWidth={1.75} />;
    }
  };

  const howIcon = (i: number) => {
    const cls = 'h-5 w-5 text-[#2563EB] sm:h-6 sm:w-6';
    if (i === 0) return <Plus className={cls} strokeWidth={1.75} />;
    if (i === 1) return <Pencil className={cls} strokeWidth={1.75} />;
    if (i === 2) return <Volume2 className={cls} strokeWidth={1.75} />;
    return <Bell className={cls} strokeWidth={1.75} />;
  };

  return (
    <div className="w-full min-w-0 overflow-x-clip bg-slate-50/95 text-slate-900 antialiased">
      <section id={heroSectionId} className="scroll-mt-10 border-b border-slate-200/70 bg-slate-50 py-14 sm:py-16">
        <div
          className={`${shell} grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-x-8`}
        >
          <div className="flex w-full min-w-0 max-w-full flex-col gap-4 sm:gap-5 lg:max-w-[min(34rem,100%)]">
            <p className="text-xs font-bold uppercase leading-none tracking-[0.14em] text-blue-600">
              Alarme rápido no navegador
            </p>
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-[-0.02em] text-slate-950 lg:text-4xl">
              {cfg.title}
            </h1>
            <p className="text-lg font-semibold text-slate-800 sm:text-xl">{cfg.subtitle}</p>
            <p className="text-base leading-relaxed text-slate-600">{cfg.description}</p>
            <p className="rounded-xl border border-blue-100/80 bg-blue-50/70 px-4 py-3 text-sm font-medium leading-relaxed text-blue-950">
              {cfg.mindset}
            </p>
            <div className={HERO_CTA_STACK}>
              <Button type="button" size="lg" variant="default" className={HERO_CTA_PRIMARY} onClick={startNow}>
                Iniciar {tempo} minutos agora
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Button>
              <Button type="button" size="lg" variant="outline" className={HERO_CTA_SECONDARY} onClick={openPreset}>
                Rever horário antes de confirmar
              </Button>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">{cfg.benefitLead}</p>
          </div>
          <div className="w-full min-w-0 lg:min-w-[380px]">
            <AlarmHubCard
              ref={hubRef}
              presetRelativeMinutes={tempo}
              presetLabelSuggestion={cfg.title}
              quickMinutePresets={TIMER_PAGE_MINUTES}
            />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16" aria-labelledby={`t-ben-${tempo}`}>
        <div className={shell}>
          <h2 id={`t-ben-${tempo}`} className={`${h2} uppercase tracking-wide`}>
            Por que {tempo} minutos
          </h2>
          <p className={sub}>{cfg.benefitLead}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cfg.benefits.map((item, i) => (
              <div key={item.title} className={card}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2563EB] bg-white sm:h-12 sm:w-12">
                  {whyIcon((['bell', 'clock', 'speaker'] as const)[i % 3])}
                </div>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-white py-14 sm:py-16" aria-labelledby={`t-use-${tempo}`}>
        <div className={shell}>
          <h2 id={`t-use-${tempo}`} className={h2}>
            Quando usar esse tempo
          </h2>
          <p className={sub}>
            Sugestões práticas — adapte ao seu ritmo. O importante é saber antes de ligar o alarme{' '}
            <strong className="font-semibold text-slate-800">o que termina quando tocar</strong>.
          </p>
          <ul className="mx-auto mt-6 max-w-2xl list-none space-y-3">
            {cfg.useCases.map(line => (
              <li key={line} className="flex items-start gap-3 text-left text-[15px] leading-relaxed text-slate-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm shadow-blue-600/15">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 sm:py-16" aria-labelledby={`t-how-${tempo}`}>
        <div className={shell}>
          <h2 id={`t-how-${tempo}`} className={`${h2} uppercase`}>
            Como usar neste contexto
          </h2>
          <p className={sub}>Passos pensados para este intervalo — além do passo a passo geral do despertador.</p>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-center md:gap-0" role="list">
            {cfg.howSteps.map((step, i) => (
              <Fragment key={step.n}>
                <div
                  className="flex min-w-0 flex-1 flex-col sm:max-w-md md:max-w-[200px] lg:max-w-[220px] md:px-2"
                  role="listitem"
                >
                  <div className="flex w-full items-start gap-2.5 text-left">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: '#2563EB' }}
                    >
                      {step.n}
                    </span>
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9"
                      style={{ backgroundColor: '#EFF6FF' }}
                    >
                      {howIcon(i)}
                    </div>
                    <div className="min-w-0 pr-0">
                      <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{step.text}</p>
                    </div>
                  </div>
                </div>
                {i < cfg.howSteps.length - 1 && (
                  <div className="my-0 flex shrink-0 self-center text-[#2563EB] md:mx-1" role="separator" aria-hidden>
                    <div className="h-0 w-full border-t border-dashed border-[#CBD5E1] md:hidden" />
                    <ChevronRight className="mt-0 hidden h-3.5 w-3.5 md:block" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-slate-50/60 py-14 sm:py-16" aria-labelledby={`t-next-${tempo}`}>
        <div className={shell}>
          <h2 id={`t-next-${tempo}`} className={h2}>
            Quer continuar?
          </h2>
          <p className={sub}>
            Progressão sugerida: experimente outro bloco quando sentir que domina este — ou volte ao despertador
            completo.
          </p>
          <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {cfg.progressionTargets.map(m => (
              <li key={m} className="sm:min-w-[180px] sm:flex-1 sm:max-w-[220px]">
                <Link
                  href={timerPagePath(m)}
                  className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:border-blue-300/60 hover:shadow-md"
                >
                  <span className="text-sm font-bold text-slate-900">{TIMER_CONFIG[m].title}</span>
                  <span className="mt-1 text-xs text-slate-600">{TIMER_CONFIG[m].subtitle}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
                    Abrir página <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
            <li className="sm:min-w-[180px] sm:flex-1 sm:max-w-[220px]">
              <Link
                href="/despertador"
                className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-slate-300/90 bg-white/80 p-5 text-center shadow-sm transition hover:bg-white"
              >
                <span className="text-sm font-bold text-slate-900">Despertador completo</span>
                <span className="mt-1 text-xs text-slate-600">Todas as opções em um só lugar</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-14 sm:py-16" aria-labelledby={`t-leituras-${tempo}`}>
        <div className={shell}>
          <h2 id={`t-leituras-${tempo}`} className="text-center text-[1.375rem] font-bold text-slate-900 sm:text-[1.4rem]">
            Leituras que combinam
          </h2>
          <p className={sub}>Aprofunde hábitos de tempo e foco no blog — conteúdo independente deste intervalo.</p>
          <ul className="mt-6 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tips.slice(0, 3).map(post => (
              <li
                key={post.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-32 w-full bg-[#F1F5F9] sm:h-36">
                  <span
                    className={`absolute left-2.5 top-2.5 z-10 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white sm:text-[10px] ${post.tagClass}`}
                  >
                    {post.tag}
                  </span>
                  <Image src={post.image} alt="" width={400} height={180} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900 sm:text-base">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.href}
                    className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-semibold text-blue-600 hover:gap-1.5 sm:text-sm"
                  >
                    Ler artigo <span aria-hidden>→</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center">
            <Link
              href="/blog"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold shadow-sm hover:bg-slate-50"
            >
              Blog completo <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
