import type { Metadata } from 'next';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlarmClock,
  ArrowRight,
  Check,
  ChevronRight,
  Cloud,
  Clock,
  ExternalLink,
  Gift,
  Globe,
  Hourglass,
  LayoutGrid,
  Package,
  RefreshCw,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Target,
  Timer,
  Zap,
} from 'lucide-react';
import { AppShell } from '@/components/layout';
import HomeHeroClockCard from '@/components/home/HomeHeroClockCard';
import HomeFaqAccordion from '@/components/home/HomeFaqAccordion';
import { Button } from '@/components/ui/button';
import { HERO_CTA_PRIMARY, HERO_CTA_SECONDARY, HERO_CTA_STACK } from '@/lib/constants/hero-cta-button-classes';

export const metadata: Metadata = {
  title: 'Relógio online com hora certa, alarme e ferramentas essenciais',
  description:
    'Relógio em tempo real, despertador, cronômetro, temporizador, Pomodoro e hora mundial no navegador. Sem instalar app.',
};

const HERO_SUB =
  'Relógio online preciso, sincronizado com servidores oficiais. Use nossos despertadores, cronômetros e temporizadores para organizar sua rotina com mais produtividade.';

const HERO_BULLETS = [
  'Sincronizado com servidores oficiais (UTC)',
  'Funciona em qualquer dispositivo',
  'Gratuito, sem cadastro e ilimitado',
  'Privacidade garantida',
] as const;

const SECTION_PORQUE =
  'Ter um relógio online sempre à mão ajuda na organização do seu tempo, aumenta a produtividade e garante que você não perca nenhum compromisso.';

const whyPillars = [
  { title: 'Sempre preciso', text: 'Sincronizado com servidores oficiais.', icon: Clock },
  { title: 'Acessível', text: 'Use de qualquer lugar, em qualquer dispositivo.', icon: Package },
  { title: 'Prático', text: 'Tudo online, sem instalações.', icon: ShoppingBag },
  { title: 'Seguro', text: 'Seus dados e alarmes ficam no seu navegador.', icon: Shield },
] as const;

const tools = [
  { href: '/', title: 'Relógio', desc: 'Hora, segundos e data alinhados ao fuso e ao idioma do sistema.', icon: 'clock' as const },
  { href: '/despertador', title: 'Despertador', desc: 'Lista de alarmes com atalhos de minutos, rótulo e controle de volume do alerta.', icon: 'alarm' as const },
  { href: '/cronometro', title: 'Cronômetro', desc: 'Mede blocos de treino, cozinha, provas simuladas ou reuniões com marcações.', icon: 'timer' as const },
  { href: '/temporizador', title: 'Temporizador', desc: 'Contagem regressiva com alerta ao fim, para cozinha ou pausas.', icon: 'hourglass' as const },
  { href: '/pomodoro', title: 'Pomodoro', desc: 'Sessões de foco com pausa configurada para reduzir fadiga.', icon: 'pomodoro' as const },
  { href: '/hora-mundial', title: 'Hora mundial', desc: 'Compare a sua hora com outras cidades para calls e prazos internacionais.', icon: 'globe' as const },
] as const;

const stepsData = [
  {
    n: 1,
    title: 'Acesse o site',
    text: 'Abra o Relógio Despertador no seu navegador.',
    Icon: Clock,
  },
  {
    n: 2,
    title: 'Escolha a ferramenta',
    text: 'Selecione entre relógio, alarme, cronômetro ou temporizador.',
    Icon: LayoutGrid,
  },
  {
    n: 3,
    title: 'Configure',
    text: 'Ajuste as opções conforme a sua necessidade.',
    Icon: Settings,
  },
  {
    n: 4,
    title: 'Use e aproveite',
    text: 'Tudo pronto! Use de forma simples e eficiente.',
    Icon: ShieldCheck,
  },
] as const;

const blogPosts = [
  {
    href: '/blog/pomodoro',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921516/tecnica-pomodoro-img-pagina-home_kzozrc.png',
    tag: 'PRODUTIVIDADE',
    tagClass: 'bg-violet-600/95',
  },
  { href: '/blog/acordar-horario-certo', image: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777921740/despertador-_hora-certa-img-pagina-home_mfbwus.png', tag: 'ROTINA', tagClass: 'bg-rose-600/95' },
  {
    href: '/blog/lembretes-5-minutos',
    image: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777921966/lembrete-a-cada-5-minutos-pagina-home_u2e9k8.png',
    tag: 'HÁBITO',
    tagClass: 'bg-emerald-600/95',
  },
  {
    href: '/blog/intervalo-10-minutos',
    image: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777922332/pausa-entre-tarefas-pagina-home_hcfycz.png',
    tag: 'FOCO',
    tagClass: 'bg-sky-600/95',
  },
  {
    href: '/blog/despertador-estudar',
    image: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777922947/despertador-para-estudar-pagina_home_v7n7fu.jpg',
    tag: 'ESTUDOS',
    tagClass: 'bg-amber-600/95',
  },
  {
    href: '/blog/disciplina-planejamento',
    image: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777923189/planejamento-e-disciplina-pagina-home_s5twcr.jpg',
    tag: 'ORGANIZAÇÃO',
    tagClass: 'bg-indigo-600/95',
  },
] as const;

const BLOG_TITLES = [
  'Como usar a técnica Pomodoro corretamente (guia completo para foco e produtividade)',
  'Despertar no horário certo',
  'Lembretes a cada 5 minutos',
  'Intervalo de 10 minutos entre tarefas',
  'Despertador para estudar',
  'Do planejado ao feito: disciplina',
] as const;

const BENEFIT_TITLES = [
  'Gratuito para sempre',
  'Privacidade total',
  'Sem instalação',
  'Sempre disponível',
  'Leve e rápido',
  'Atualizações constantes',
] as const;

const benefitIcons = [Gift, Shield, Package, Cloud, Zap, RefreshCw] as const;

const section = 'py-16';
const h2 = 'text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl';

function ToolIcon({ kind }: { kind: (typeof tools)[number]['icon'] }) {
  const common = 'h-7 w-7';
  switch (kind) {
    case 'clock':
      return <Clock className={common} aria-hidden />;
    case 'alarm':
      return <AlarmClock className={common} aria-hidden />;
    case 'timer':
      return <Timer className={common} aria-hidden />;
    case 'hourglass':
      return <Hourglass className={common} aria-hidden />;
    case 'pomodoro':
      return (
        <span className="flex h-7 w-7 items-center justify-center text-xl leading-none" title="Pomodoro" aria-hidden>
          🍅
        </span>
      );
    case 'globe':
      return <Globe className={common} aria-hidden />;
    default:
      return null;
  }
}

function StepConnector() {
  return (
    <div className="flex flex-col items-center justify-center" aria-hidden>
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-600" />
      <div className="my-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-400 shadow-sm dark:border-slate-600 dark:bg-slate-800">
        <ChevronRight className="h-3.5 w-3.5" />
      </div>
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-600" />
    </div>
  );
}

function UsarStepColumn({ step }: { step: (typeof stepsData)[number] }) {
  const I = step.Icon;
  return (
    <div className="flex w-full max-w-xs flex-col items-center text-center sm:max-w-sm">
      <div className="relative">
        <span
          className="absolute -left-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm"
          aria-hidden
        >
          {step.n}
        </span>
        <div className="inline-flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border border-slate-100/90 bg-white p-5 text-blue-600 shadow-sm dark:border-slate-600/80 dark:bg-slate-800/80 dark:text-blue-400">
          <I className="h-10 w-10" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-base dark:text-white">{step.title}</h3>
      <p className="mx-auto mt-1.5 max-w-[14rem] text-xs leading-relaxed text-slate-600 sm:max-w-[12.5rem] sm:text-sm dark:text-slate-400">
        {step.text}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell maxWidth="6xl" className="!space-y-0 !px-4 !pb-0 !pt-0">
      <section
        className="-mx-4 bg-[#F8F9FA] px-4 py-14 sm:py-16 dark:bg-slate-900/30"
        aria-label="Apresentação"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-0">
          <div className="order-1 flex w-full min-w-0 flex-col items-start gap-5 text-left md:gap-6 lg:col-span-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#EEF2FF] px-3.5 py-2 text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-[#0052FF] sm:text-[11px] sm:tracking-[0.1em] dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300 [&>svg]:shrink-0">
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              100% online e gratuito
            </p>
            <h1 className="w-full max-w-xl text-pretty text-4xl font-bold leading-[1.08] tracking-tight text-[#1A1A1A] sm:max-w-2xl sm:text-[2.5rem] sm:leading-[1.08] md:text-[2.75rem] lg:text-[2.85rem] dark:text-slate-50">
              Hora exata em <span className="text-[#0052FF]">tempo real</span> para o seu dia ser mais
              produtivo
            </h1>
            <p className="max-w-xl text-left text-pretty text-[15px] leading-[1.65] text-[#6B7280] sm:max-w-[28rem] sm:text-base sm:leading-[1.7] dark:text-slate-400">
              {HERO_SUB}
            </p>
            <ul className="flex w-full max-w-lg flex-col gap-3">
              {HERO_BULLETS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-left text-[15px] font-medium text-[#1A1A1A] dark:text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0052FF] text-white shadow-sm">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className={HERO_CTA_STACK}>
              <Button asChild size="lg" className={HERO_CTA_PRIMARY}>
                <Link href="#t-ferramentas" className="inline-flex items-center justify-center gap-2">
                  Explorar ferramentas
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={HERO_CTA_SECONDARY}>
                <Link href="/despertador" className="inline-flex items-center justify-center gap-2">
                  <AlarmClock className="h-4 w-4 text-[#0052FF]" aria-hidden />
                  Configurar alarme
                </Link>
              </Button>
            </div>
          </div>
          <div className="order-2 flex w-full min-w-0 justify-center lg:col-span-6 lg:justify-end">
            <div className="w-full min-w-0 max-w-md sm:max-w-xl lg:max-w-none">
              <HomeHeroClockCard />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${section} scroll-mt-10 border-t border-slate-200/60 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/20`}
        id="por-que-online"
        aria-labelledby="t-por-que"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-8">
            <div className="w-full shrink-0 md:max-w-md lg:w-[40%] lg:max-w-none">
              <h2 id="t-por-que" className={h2}>
                Por que usar um relógio online?
              </h2>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                {SECTION_PORQUE}
              </p>
            </div>
            <ul className="grid flex-1 grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-4">
              {whyPillars.map((p) => {
                const I = p.icon;
                return (
                  <li
                    key={p.title}
                    className="flex min-w-0 flex-col items-center text-center"
                  >
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100/90 bg-white text-blue-600 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-blue-400"
                      aria-hidden
                    >
                      <I className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</p>
                    <p className="mt-1.5 text-xs leading-snug text-slate-600 sm:text-sm dark:text-slate-400">
                      {p.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="t-ferramentas">
        <h2 id="t-ferramentas" className={`${h2} text-center`}>
          Ferramentas para o seu dia a dia
        </h2>
        <ul className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <li key={t.title}>
              <Link
                href={t.href}
                className="group flex h-full min-h-[200px] flex-col items-center rounded-xl border border-slate-200/90 bg-white p-6 text-center shadow-sm transition hover:-translate-y-px hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/50"
              >
                <span
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-blue-600 ${t.icon === 'pomodoro' ? 'bg-red-50' : 'bg-blue-50'} dark:bg-blue-950/30 ${t.icon === 'pomodoro' ? 'dark:bg-red-950/20' : ''}`}
                >
                  <ToolIcon kind={t.icon} />
                </span>
                <span className="mt-3 text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white">
                  {t.title}
                </span>
                <p className="mt-2 flex-1 text-sm leading-snug text-slate-500 dark:text-slate-400">{t.desc}</p>
                <span className="mt-3 inline-flex items-center justify-center gap-0.5 text-sm font-semibold text-blue-600">
                  Abrir ferramenta
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className={`${section} border-t border-slate-200/80 bg-gradient-to-b from-slate-50/90 to-white dark:border-slate-800 dark:from-slate-900/30 dark:to-slate-900/10`}
        aria-labelledby="t-passos"
        id="como-usar"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="t-passos" className={h2}>
            Como usar em 4 passos simples
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            É rápido, fácil e intuitivo.
          </p>

          <nav aria-label="Como usar em 4 passos" className="mt-6">
            <ol className="w-full list-none space-y-0 lg:hidden">
              {stepsData.map((step, i) => (
                <Fragment key={step.n}>
                  <li>
                    <UsarStepColumn step={step} />
                  </li>
                  {i < 3 && (
                    <li className="flex list-none justify-center py-1" aria-hidden>
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-px bg-slate-200 dark:bg-slate-600" />
                        <div className="my-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-400 shadow-sm dark:border-slate-600 dark:bg-slate-800">
                          <ChevronRight className="h-3.5 w-3.5 -rotate-90" />
                        </div>
                        <div className="h-3 w-px bg-slate-200 dark:bg-slate-600" />
                      </div>
                    </li>
                  )}
                </Fragment>
              ))}
            </ol>
            <ol className="mt-0 hidden w-full list-none gap-y-0 lg:mt-0 lg:grid lg:grid-cols-7 lg:items-start lg:gap-x-1">
              {stepsData.flatMap((step, idx) => {
                const stepItem = (
                  <li
                    key={step.n}
                    className="col-span-1 flex w-full list-none items-start justify-center"
                  >
                    <UsarStepColumn step={step} />
                  </li>
                );
                if (idx < stepsData.length - 1) {
                  return [
                    stepItem,
                    <li
                      key={`conn-${idx}`}
                      className="col-span-1 m-0 flex min-h-[140px] w-full list-none items-center justify-center p-0"
                      aria-hidden
                    >
                      <StepConnector />
                    </li>,
                  ] as const;
                }
                return [stepItem] as const;
              })}
            </ol>
          </nav>
        </div>
      </section>

      <section className={section} aria-labelledby="t-blog" id="blog-dicas">
        <h2 id="t-blog" className={h2}>
          Dicas e conteúdos para uma rotina melhor
        </h2>
        <ul className="mt-6 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <li key={post.href} className="min-w-0">
              <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50">
                <div className="relative aspect-[2/1] w-full">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 18vw, 45vw"
                  />
                  <span
                    className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-white ${post.tagClass}`}
                  >
                    {post.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="line-clamp-3 text-left text-sm font-bold leading-tight text-slate-900 dark:text-white">
                    <Link href={post.href} className="hover:text-blue-600">
                      {BLOG_TITLES[i]}
                    </Link>
                  </h3>
                  <Link
                    href={post.href}
                    className="mt-2 inline-flex items-center gap-0.5 self-start text-xs font-semibold text-blue-600"
                  >
                    Ler artigo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
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
      </section>

      <section
        className={`${section} border-t border-slate-200/80 dark:border-slate-800`}
        aria-labelledby="t-beneficios"
        id="beneficios"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 id="t-beneficios" className={h2}>
              Por que escolher o Relógio Despertador?
            </h2>
            <ul className="mt-8 grid max-w-md grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {BENEFIT_TITLES.map((t, i) => {
                const I = benefitIcons[i];
                return (
                  <li
                    key={t}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-100 text-blue-600 dark:border-blue-900/50">
                      <I className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">{t}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h2 className={h2}>Perguntas frequentes</h2>
            <div className="mt-4 min-w-0 max-w-lg">
              <HomeFaqAccordion />
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${section} rounded-2xl border border-blue-100/80 bg-blue-50/80 px-4 dark:border-blue-900/30 dark:bg-[#0f1f35]/50`}
        aria-label="Chamada final"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3 md:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-800">
              <Clock className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pronto para ser mais produtivo?</h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
            <Button asChild className="h-11 w-full min-h-[48px] rounded-lg bg-blue-600 px-5 sm:w-auto" size="lg">
              <a href="#hora-certa" className="inline-flex items-center justify-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4" aria-hidden />
                Ver hora certa
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full min-h-[48px] rounded-lg border-2 border-slate-200/90 bg-white px-5 sm:w-auto dark:border-slate-600 dark:bg-slate-800"
              size="lg"
            >
              <Link href="/despertador" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <AlarmClock className="h-4 w-4 text-blue-600" aria-hidden />
                Configurar alarme
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
