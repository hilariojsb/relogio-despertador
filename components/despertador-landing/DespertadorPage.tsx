'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
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
import { AlarmHubCard } from '@/components/despertador-landing/AlarmHubCard';
import {
  c,
  heroSectionId,
  cta,
  faqItems,
  howSteps,
  howSub,
  howTitle,
  related,
  tips,
  tipsSub,
  tipsTitle,
  tipsTitleSpan,
  whyItems,
  whySub,
  whyTitle,
} from '@/components/despertador-landing/despertador-content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BANNER_CTA_PRIMARY } from '@/lib/constants/hero-cta-button-classes';
import { cn } from '@/lib/utils';

const shell = 'mx-auto w-full min-w-0 max-w-6xl px-4';
const h2 = 'text-center text-[1.375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]';
const sub = 'mx-auto mt-3 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base';
const card =
  'rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:border-slate-200 hover:shadow-md hover:shadow-slate-900/5';

const whyIcon = (key: (typeof whyItems)[number]['key']) => {
  const cls = 'h-5 w-5 sm:h-6 sm:w-6 text-[#2563EB]';
  switch (key) {
    case 'bell':
      return <Bell className={cls} strokeWidth={1.75} />;
    case 'clock':
      return <Clock className={cls} strokeWidth={1.75} />;
    case 'speaker':
      return <Volume2 className={cls} strokeWidth={1.75} />;
    case 'shield':
      return <Shield className={cls} strokeWidth={1.75} />;
    default:
      return null;
  }
};

const howIcon = (i: number) => {
  const cls = 'h-5 w-5 text-[#2563EB] sm:h-6 sm:w-6';
  if (i === 0) return <Plus className={cls} strokeWidth={1.75} />;
  if (i === 1) return <Pencil className={cls} strokeWidth={1.75} />;
  if (i === 2) return <Volume2 className={cls} strokeWidth={1.75} />;
  return <Bell className={cls} strokeWidth={1.75} />;
};

export function DespertadorPage() {
  return (
    <div className="w-full min-w-0 overflow-x-clip bg-slate-50/95 text-slate-900 antialiased">
      <section
        id={heroSectionId}
        className="scroll-mt-10 border-b border-slate-200/70 bg-slate-50 py-16"
      >
        <div
          className={`${shell} grid w-full min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-x-8 lg:gap-y-0`}
        >
          <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col gap-4 sm:gap-5 lg:max-w-[min(34rem,100%)] lg:justify-self-start lg:pt-0.5">
            <p className="shrink-0 text-xs font-bold uppercase leading-none tracking-[0.14em] text-blue-600">
              {c.label}
            </p>
            <h1 className="shrink-0 text-balance text-3xl font-bold leading-tight tracking-[-0.02em] text-slate-950 lg:text-4xl">
              Despertador <span className="text-blue-600">online</span> grátis
            </h1>
            <div className="shrink-0 text-base leading-relaxed text-slate-600">
              {c.descLines.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
            <ul className="w-full max-w-md shrink-0 list-none space-y-3" role="list">
              {c.bullets.map(t => (
                <li
                  key={t}
                  className="flex min-w-0 items-start gap-3.5 text-base font-normal leading-relaxed text-slate-800"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow-sm shadow-blue-600/20 ring-1 ring-blue-600/10">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />
                  </span>
                  <span className="min-w-0 break-words">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full min-w-0 max-w-full shrink-0 self-start justify-self-stretch sm:max-w-full lg:min-w-[380px] lg:max-w-[520px] lg:justify-self-end">
            <AlarmHubCard />
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="t-pq">
        <div className={shell}>
          <h2 id="t-pq" className={`${h2} uppercase tracking-wide`}>
            {whyTitle}
          </h2>
          <p className={sub}>{whySub}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(item => (
              <div key={item.title} className={card}>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#2563EB] bg-white sm:h-12 sm:w-12">
                  {whyIcon(item.key)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 sm:text-base">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-white py-16" aria-labelledby="t-como">
        <div className={shell}>
          <h2 id="t-como" className={`${h2} uppercase`}>
            {howTitle}
          </h2>
          <p className={sub}>{howSub}</p>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-center md:gap-0" role="list">
            {howSteps.map((step, i) => (
              <Fragment key={step.n}>
                <div
                  className="flex min-w-0 flex-1 flex-col sm:max-w-md md:max-w-[200px] lg:max-w-[220px] xl:max-w-[250px] md:px-2"
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
                {i < howSteps.length - 1 && (
                  <div
                    className="my-0 flex shrink-0 self-center text-[#2563EB] md:mx-1 md:px-0"
                    role="separator"
                    aria-hidden
                  >
                    <div className="h-0 w-full border-t border-dashed border-[#CBD5E1] md:hidden" />
                    <ChevronRight className="mt-0 hidden h-3.5 w-3.5 sm:h-4 sm:w-4 md:block" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="t-dicas">
        <div className={shell}>
          <h2 id="t-dicas" className="text-center text-[1.375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">
            {tipsTitle}{' '}
            <span className="text-blue-600">{tipsTitleSpan}</span>
          </h2>
          <p className={sub}>{tipsSub}</p>
          <ul className="mt-6 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tips.map(post => (
                <li
                key={post.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 ease-out hover:border-slate-200 hover:shadow-md hover:shadow-slate-900/5"
              >
                <div className="relative h-32 w-full bg-[#F1F5F9] sm:h-36">
                  <span
                    className={`absolute left-2.5 top-2.5 z-10 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white sm:text-[10px] sm:left-3 sm:top-3 sm:px-2 ${post.tagClass}`}
                  >
                    {post.tag}
                  </span>
                  <Image
                    src={post.image}
                    alt=""
                    width={400}
                    height={180}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:text-base">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.href}
                    className="mt-3 inline-flex w-fit min-h-9 items-center gap-1 text-xs font-semibold text-blue-600 transition duration-200 ease-out hover:gap-1.5 hover:text-blue-700 sm:text-sm"
                  >
                    Ler artigo
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full min-w-0 max-w-sm rounded-lg border-2 border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 sm:w-auto sm:max-w-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <Link href="/blog" className="inline-flex items-center justify-center gap-2">
                Ver todos os artigos do blog
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-slate-50/40 py-16" aria-label="Perguntas e buscas">
        <div className={`${shell} grid gap-10 md:grid-cols-2 md:items-start md:gap-12`}>
          <div>
            <h2 className="text-left text-[1.375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="mt-5 w-full space-y-0 border-t border-[#E2E8F0]">
              {faqItems.map((item, i) => (
                <AccordionItem key={item.q} value={`a-${i}`} className="border-b border-[#E2E8F0]">
                  <AccordionTrigger className="py-3.5 text-left text-sm font-semibold text-[#0F172A] hover:no-underline sm:text-[15px]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#64748B] pb-4 pr-1 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <h2 className="text-left text-[1.375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.4rem]">
              Buscas relacionadas
            </h2>
            <p className="mt-1.5 max-w-md text-[13px] leading-snug text-slate-600 sm:text-sm">
              Aprofunde sua rotina com ferramentas e guias relacionados.
            </p>
            <nav className="mt-4 border-t border-[#E2E8F0] pt-4" aria-label="Sugestões de busca relacionadas">
              <ul className="grid list-none grid-cols-1 gap-1.5 sm:gap-1.5">
                {related.map(x => (
                  <li key={x.href + x.text}>
                    <Link
                      href={x.href}
                      className={cn(
                        'group flex min-h-0 w-full items-center gap-2 rounded-lg border border-slate-200/85 bg-white px-2 py-[5px] text-left shadow-[0_1px_2px_rgba(15,23,42,0.035)] ring-1 ring-slate-950/[0.02]',
                        'transition-[transform,box-shadow,background-color,border-color,ring-color] duration-200 ease-out',
                        'hover:-translate-y-px hover:border-[#0052FF]/35 hover:bg-blue-50/80 hover:shadow-[0_8px_22px_-8px_rgba(37,99,235,0.2),0_2px_5px_rgba(15,23,42,0.04)] hover:ring-[#0052FF]/12',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-blue-50 text-[#2563EB] ring-1 ring-blue-100/75',
                          'transition-[background-color,color,box-shadow,ring-color] duration-200 ease-out group-hover:bg-[#0052FF] group-hover:text-white group-hover:ring-[#0046e0]/30 group-hover:shadow-sm',
                        )}
                        aria-hidden
                      >
                        <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      <span className="min-w-0 flex-1 text-[12px] font-medium leading-snug text-slate-800 transition-colors duration-150 sm:text-[12.5px] group-hover:text-[#0f172a]">
                        {x.text}
                      </span>
                      <ChevronRight
                        className="h-3 w-3 shrink-0 text-slate-300 transition-[transform,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-[#0052FF] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50/80 to-sky-50/30 py-16" aria-label="Ação principal">
        <div className={shell}>
          <div className="flex flex-col gap-7 overflow-hidden rounded-2xl border border-sky-200/50 bg-white/95 p-6 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-shadow duration-300 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-2xl bg-sky-100 ring-1 ring-sky-200/60 sm:h-14 sm:w-14 md:self-center">
              <Bell className="h-6 w-6 text-[#0052FF] sm:h-7 sm:w-7" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1 text-center md:text-left md:self-center">
              <h2 className="text-[1.25rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-[1.375rem]">
                {cta.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">{cta.desc}</p>
            </div>
            <Link
              href={`#${heroSectionId}`}
              className={cn(
                BANNER_CTA_PRIMARY,
                'group w-full shrink-0 md:w-auto md:min-w-[14.5rem] md:self-center',
              )}
            >
              <Plus className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.75} aria-hidden />
              Adicionar alarme
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
