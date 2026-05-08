import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import type { BlogArticle, BlogArticleHighlight } from '@/lib/blog-articles/types';
import { getArticleFooterCta } from '@/lib/blog-articles/article-footer-cta';
import { ParagraphBody } from '@/components/blog-landing/inline-paragraph';

function articleShellClass(fluidColumn: boolean) {
  return fluidColumn
    ? 'w-full min-w-0 px-4 text-left'
    : 'mx-auto w-full max-w-[760px] min-[1200px]:max-w-[800px] px-4 text-left';
}

const pClass =
  'text-left text-[17px] leading-[1.72] text-slate-600 dark:text-slate-300 sm:text-[17px] max-w-[68ch]';
const h2Class =
  'mt-0 mb-3 scroll-mt-28 text-[1.375rem] font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-[1.625rem] dark:text-white max-w-[68ch]';
const h3Class =
  'mt-10 scroll-mt-24 text-lg font-semibold text-slate-900 sm:mt-11 sm:text-xl dark:text-white max-w-[68ch]';
const ulClass =
  'my-6 list-disc space-y-2.5 pl-5 text-left text-[17px] leading-[1.72] text-slate-600 marker:text-[#2563eb] dark:text-slate-300 dark:marker:text-sky-400 max-w-[68ch]';

const sectionClassDefault = 'mt-14 sm:mt-[4.25rem]';

/** 16:9 ≈ 1200×675; cantos 12px (rounded-xl); espaço vertical ≥24px em relação ao fluxo. */
const mediaFrame =
  'relative w-full overflow-hidden rounded-xl shadow-md ring-1 ring-slate-900/5 dark:shadow-lg dark:shadow-black/30 dark:ring-white/10';

const PLACEHOLDER_LABEL = 'Ilustração do artigo em preparação' as const;

const placeholderCard =
  'relative min-h-[280px] overflow-hidden rounded-xl ring-1 ring-slate-200/90 dark:ring-slate-700/55';

function ArticleImagePlaceholder({
  variant,
  altContext,
}: {
  variant: 'hero' | 'mid';
  /** Texto para acessibilidade (tema da futura imagem). */
  altContext: string;
}) {
  const spacing = variant === 'hero' ? 'mt-8 mb-10 sm:mb-12' : 'my-8 sm:my-12';
  const ariaLabel = `${PLACEHOLDER_LABEL}. ${variant === 'hero' ? 'Topo do artigo.' : 'Meio do artigo.'} ${altContext}`;
  return (
    <figure className={cn('mx-auto w-full text-left', spacing)}>
      <div style={{ aspectRatio: '16 / 9' }} className={cn(placeholderCard)}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-200/90 via-slate-100 to-slate-200/80 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900/80"
          aria-hidden
        />
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/35 to-transparent dark:via-white/[0.07]"
          aria-hidden
        />
        <div
          className="relative flex min-h-[280px] flex-col items-center justify-center gap-3 px-8 py-10"
          role="img"
          aria-label={ariaLabel}
        >
          <div className="h-2.5 w-[72%] max-w-md rounded-full bg-slate-300/85 dark:bg-slate-600/70" aria-hidden />
          <div className="h-2.5 w-[48%] max-w-xs rounded-full bg-slate-300/70 dark:bg-slate-600/55" aria-hidden />
          <div className="mt-2 h-2 w-[36%] max-w-[200px] rounded-full bg-slate-300/55 dark:bg-slate-600/40" aria-hidden />
        </div>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    </figure>
  );
}

function ArticleFigure({
  src,
  alt,
  variant,
}: {
  src: string;
  alt: string;
  variant: 'hero' | 'mid';
}) {
  const isSvg = src.endsWith('.svg');
  const objectFit = isSvg
    ? 'object-contain bg-slate-100 dark:bg-slate-800/90'
    : 'object-cover';

  return (
    <figure
      className={cn(
        'mx-auto w-full text-left',
        variant === 'hero' ? 'mt-8 mb-10 sm:mb-12' : 'my-8 sm:my-12'
      )}
    >
      <div className={cn(mediaFrame, 'relative aspect-video min-h-[320px]')}>
        <Image
          src={src}
          alt={alt}
          fill
          className={objectFit}
          sizes="(max-width: 760px) 100vw, 800px"
        />
      </div>
    </figure>
  );
}

function ArticleHeroMedia({ slot }: { slot: BlogArticle['heroImage'] }) {
  if (slot.src) {
    return <ArticleFigure variant="hero" src={slot.src} alt={slot.alt} />;
  }
  return <ArticleImagePlaceholder variant="hero" altContext={slot.alt} />;
}

function ArticleMidMedia({ slot }: { slot: BlogArticle['midArticleImage'] }) {
  if (slot.src) {
    return <ArticleFigure variant="mid" src={slot.src} alt={slot.alt} />;
  }
  return <ArticleImagePlaceholder variant="mid" altContext={slot.alt} />;
}

function SectionHighlight({ highlight }: { highlight: BlogArticleHighlight }) {
  const isTip = highlight.variant === 'tip';
  return (
    <aside
      className={cn(
        'mt-8 max-w-[min(100%,68ch)] rounded-r-xl border-y border-r p-5 text-left text-[17px] leading-[1.72] shadow-sm dark:shadow-black/20',
        isTip
          ? 'border-amber-200/90 border-l-[3px] border-l-amber-500 bg-gradient-to-br from-amber-50 to-amber-50/35 text-slate-900 dark:border-amber-800/50 dark:border-l-amber-400 dark:from-amber-950/45 dark:to-amber-950/15 dark:text-amber-50'
          : 'border-orange-200/90 border-l-[3px] border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-50/30 text-slate-900 dark:border-orange-800/50 dark:border-l-orange-400 dark:from-orange-950/35 dark:to-orange-950/10 dark:text-orange-50'
      )}
    >
      <div className="flex gap-4">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10',
            isTip
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
          )}
          aria-hidden
        >
          {isTip ? <Lightbulb className="h-5 w-5" strokeWidth={2.25} /> : <AlertTriangle className="h-5 w-5" strokeWidth={2.25} />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 dark:text-white">{isTip ? 'Dica' : 'Erro comum'}</p>
          <p className="mt-2 mb-0 text-slate-700 dark:text-slate-200">
            <ParagraphBody text={highlight.body} />
          </p>
        </div>
      </div>
    </aside>
  );
}

/** Leitura isolada: preview sem CTA de ferramentas. */
const readingShell = (fluid: boolean) => cn(articleShellClass(fluid), 'pb-20 pt-10');

const reading = {
  header: 'border-b border-slate-200 pb-10',
  badge: 'inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800',
  h1: 'mt-4 text-pretty text-[2rem] font-bold leading-[1.15] tracking-tight text-[#0f172a] sm:text-[2.5rem] sm:leading-[1.12]',
  tagline:
    'mt-4 max-w-[40ch] text-pretty text-[1.25rem] font-medium leading-snug text-[#334155] sm:text-[1.375rem] dark:text-slate-300',
  deck: 'mt-5 text-pretty text-lg leading-[1.7] text-slate-600 sm:text-xl',
  meta: 'mt-5 text-sm text-slate-500',
  formatBadgeWrap: 'mt-3 flex flex-wrap gap-2',
  formatBadgeBase:
    'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
  formatBadgeQuick:
    'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/15 dark:bg-emerald-950/45 dark:text-emerald-200 dark:ring-emerald-500/25',
  formatBadgeGuide:
    'bg-blue-50 text-blue-800 ring-1 ring-blue-600/15 dark:bg-blue-950/45 dark:text-blue-200 dark:ring-blue-500/25',
  quickSummaryWrap:
    'mt-8 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm dark:border-slate-700/60 dark:from-slate-900/50 dark:to-slate-950/30 sm:p-6',
  quickSummaryLabel:
    'text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400',
  quickSummaryUl:
    'mt-3.5 mb-0 list-disc space-y-2.5 pl-5 text-left text-[16px] leading-snug text-slate-800 dark:text-slate-100 sm:text-[17px] sm:leading-relaxed',
  introWrap: 'pt-10',
  p: 'text-left text-[17px] leading-[1.72] text-[#0f172a] sm:text-[18px] max-w-[68ch]',
  introP: 'mb-5 last:mb-0',
  section: 'mt-14 sm:mt-[4.25rem]',
  h2: 'mb-3 scroll-mt-8 text-[1.375rem] font-bold leading-snug tracking-tight text-[#0f172a] first:mt-0 sm:mb-4 sm:text-[1.625rem] max-w-[68ch]',
  bodyP: 'mt-5',
  h3: 'mt-10 scroll-mt-24 text-[1.125rem] font-semibold text-[#0f172a] sm:mt-11 sm:text-xl max-w-[68ch]',
  subP: 'mt-4',
  ul: 'my-6 list-disc space-y-2.5 pl-5 text-left text-[17px] leading-[1.72] text-[#0f172a] marker:text-[#2563eb] sm:text-[18px] max-w-[68ch]',
  conclusionWrap: 'mt-20 border-t border-slate-200 pt-16',
  conclusionH2: 'mb-3 max-w-[68ch] text-[1.375rem] font-bold text-[#0f172a] sm:text-[1.625rem]',
  tip: 'mt-12 rounded-r-xl border border-slate-200/90 border-l-4 border-l-[#2563eb] bg-gradient-to-br from-white to-slate-50/90 p-6 shadow-sm sm:p-8 dark:border-slate-700/80 dark:from-slate-900/40 dark:to-slate-950/40',
  tipLabel: 'text-sm font-semibold text-[#2563eb]',
  tipP: 'mt-3 mb-0',
} as const;

export type BlogArticleTemplateVariant = 'default' | 'reading';

export type BlogArticleTemplateProps = {
  article: BlogArticle;
  variant?: BlogArticleTemplateVariant;
  /** Em grelha com sidebar: sem max-width centralizado aqui (a coluna do pai define a largura). */
  fluidColumn?: boolean;
};

/**
 * Template único de artigo do blog: cabeçalho SEO, imagens ou placeholders,
 * seções H2, destaques, conclusão e bloco de ferramentas.
 */
export function BlogArticleTemplate({
  article,
  variant = 'default',
  fluidColumn = false,
}: BlogArticleTemplateProps) {
  const isReading = variant === 'reading';
  const shell = isReading ? readingShell(fluidColumn) : cn(articleShellClass(fluidColumn));

  const pCls = isReading ? reading.p : pClass;
  const h2Cls = isReading ? reading.h2 : h2Class;
  const h3Cls = isReading ? reading.h3 : h3Class;
  const ulCls = isReading ? reading.ul : ulClass;
  const sectionGap = isReading ? reading.section : sectionClassDefault;

  const footerCta = getArticleFooterCta(article.category);

  const formatBadges = (
    <div className={isReading ? reading.formatBadgeWrap : 'mt-3 flex flex-wrap gap-2'}>
      <span className={cn(reading.formatBadgeBase, reading.formatBadgeQuick)}>Leitura rápida</span>
      <span className={cn(reading.formatBadgeBase, reading.formatBadgeGuide)}>Guia prático</span>
    </div>
  );

  const categoryBadge = (
    <span
      className={
        isReading
          ? reading.badge
          : 'inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800 dark:bg-blue-950/60 dark:text-blue-200'
      }
    >
      {article.category}
    </span>
  );

  return (
    <article className={shell} itemScope itemType="https://schema.org/Article">
      <meta itemProp="headline" content={article.title} />
      <meta itemProp="description" content={article.description} />
      <meta itemProp="datePublished" content={`${article.publishedAt}T12:00:00-03:00`} />

      <header
        className={
          isReading
            ? reading.header
            : 'border-b border-slate-200/80 pb-8 dark:border-slate-700/60'
        }
      >
        <p className="m-0">{categoryBadge}</p>
        <h1
          className={
            isReading
              ? reading.h1
              : cn(
                  'mt-3 text-pretty text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[2.125rem] sm:leading-tight dark:text-white'
                )
          }
        >
          {article.title}
        </h1>
        {article.tagline?.trim() ? (
          <p className={isReading ? reading.tagline : cn('mt-4 max-w-[40ch] text-pretty text-xl font-medium leading-snug text-slate-700 dark:text-slate-300 sm:text-2xl')}>
            {article.tagline.trim()}
          </p>
        ) : null}
        <p
          className={
            isReading
              ? reading.deck
              : cn(
                  'text-pretty text-lg leading-[1.7] text-[#64748b] dark:text-slate-400',
                  article.tagline?.trim() ? 'mt-5' : 'mt-4'
                )
          }
        >
          {article.description}
        </p>
        <p className={isReading ? reading.meta : 'mt-4 text-sm text-slate-500 dark:text-slate-400'}>
          Publicado em{' '}
          <time itemProp="datePublished" dateTime={`${article.publishedAt}T12:00:00-03:00`}>
            {new Date(article.publishedAt + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </p>
        {formatBadges}
      </header>

      <aside
        className={reading.quickSummaryWrap}
        aria-label="Resumo rápido do artigo"
      >
        <p className={cn('m-0', reading.quickSummaryLabel)}>Resumo rápido</p>
        <ul className={reading.quickSummaryUl}>
          {article.quickSummary.map((line, i) => (
            <li key={`${article.slug}-qs-${i}`}>
              <ParagraphBody text={line} />
            </li>
          ))}
        </ul>
      </aside>

      <ArticleHeroMedia slot={article.heroImage} />

      <div className={isReading ? reading.introWrap : 'pt-10'}>
        {article.intro.map((para, i) => (
          <p key={i} className={isReading ? cn(pCls, reading.introP) : cn(pCls, 'mb-5 last:mb-0')}>
            <ParagraphBody text={para} />
          </p>
        ))}
      </div>

      {article.sections.map((section, si) => (
        <Fragment key={`${article.slug}-s${si}`}>
          <section className={sectionGap} aria-labelledby={`section-${article.slug}-${si}`}>
            <h2 id={`section-${article.slug}-${si}`} className={h2Cls}>
              {section.h2}
            </h2>
            {section.paragraphs.map((para, i) => (
              <p
                key={i}
                className={
                  isReading
                    ? cn(pCls, i === 0 ? 'mt-4' : reading.bodyP)
                    : cn(pCls, i === 0 ? 'mt-4' : 'mt-5')
                }
              >
                <ParagraphBody text={para} />
              </p>
            ))}
            {section.list && section.list.length > 0 && (
              <ul className={ulCls}>
                {section.list.map((item) => (
                  <li key={item}>
                    <ParagraphBody text={item} />
                  </li>
                ))}
              </ul>
            )}
            {section.subsections?.map((sub) => (
              <div key={sub.h3}>
                <h3 className={h3Cls}>{sub.h3}</h3>
                {sub.paragraphs.map((para, i) => (
                  <p key={i} className={isReading ? cn(pCls, reading.subP) : cn(pCls, 'mt-4')}>
                    <ParagraphBody text={para} />
                  </p>
                ))}
                {sub.list && sub.list.length > 0 && (
                  <ul className={ulCls}>
                    {sub.list.map((item) => (
                      <li key={item}>
                        <ParagraphBody text={item} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {section.highlights?.map((h, hi) => (
              <SectionHighlight key={`${section.h2}-h-${hi}`} highlight={h} />
            ))}
          </section>
          {article.midArticleImage.afterSectionIndex === si && (
            <ArticleMidMedia slot={article.midArticleImage} />
          )}
        </Fragment>
      ))}

      <section
        className={
          isReading
            ? reading.conclusionWrap
            : 'mt-20 border-t border-slate-200/80 pt-16 dark:border-slate-700/60'
        }
      >
        <h2
          className={
            isReading
              ? reading.conclusionH2
              : 'mb-3 max-w-[68ch] text-xl font-bold text-slate-900 sm:mb-4 sm:text-2xl dark:text-white'
          }
        >
          Conclusão
        </h2>
        {article.conclusion.map((para, i) => (
          <p
            key={i}
            className={
              isReading
                ? cn(pCls, i === 0 ? 'mt-4' : reading.bodyP)
                : cn(pCls, i === 0 ? 'mt-4' : 'mt-5')
            }
          >
            <ParagraphBody text={para} />
          </p>
        ))}
      </section>

      {article.tip && (
        <aside
          className={
            isReading
              ? reading.tip
              : 'mt-12 rounded-r-xl border border-blue-100/95 border-l-4 border-l-[#2563eb] bg-gradient-to-br from-blue-50/95 to-white p-6 shadow-sm dark:border-blue-900/45 dark:from-blue-950/35 dark:to-slate-900/50 sm:p-8'
          }
          aria-label="Dica prática"
        >
          <div className="flex gap-4">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb] shadow-sm ring-1 ring-blue-900/5 dark:bg-blue-900/40 dark:text-sky-300 dark:ring-white/10"
              aria-hidden
            >
              <Lightbulb className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className={isReading ? reading.tipLabel : 'text-sm font-semibold text-[#2563eb]'}>Dica prática</p>
              <p className={isReading ? cn(pCls, reading.tipP) : cn(pCls, 'mt-3 mb-0')}>
                <ParagraphBody text={article.tip} />
              </p>
            </div>
          </div>
        </aside>
      )}

      {!isReading && (
        <section
          className={cn(
            'relative mx-auto mt-16 max-w-[min(100%,42rem)] overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/70 px-6 py-10 shadow-sm ring-1 ring-slate-900/[0.04] sm:px-10 sm:py-12',
            'dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900/95 dark:to-blue-950/35 dark:ring-white/[0.06]'
          )}
          aria-labelledby={`article-cta-${article.slug}`}
        >
          <div
            className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
            aria-hidden
          />
          <div className="relative flex flex-col items-center text-center">
            <h2
              id={`article-cta-${article.slug}`}
              className="text-pretty text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
            >
              {footerCta.title}
            </h2>
            <p className="mt-3 max-w-[34ch] text-pretty text-base leading-relaxed text-slate-600 sm:text-[17px] dark:text-slate-300">
              {footerCta.description}
            </p>
            <Link
              href={footerCta.primaryHref}
              className={cn(
                'group mt-8 inline-flex min-h-[3rem] w-full max-w-sm items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 ease-out sm:w-auto sm:min-w-[220px]',
                'bg-[#2563eb] hover:bg-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900'
              )}
            >
              {footerCta.primaryLabel}
              <ArrowRight
                className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <nav
              className="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm"
              aria-label="Outras ferramentas rápidas"
            >
              {footerCta.secondaryLinks.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 ? (
                    <span className="hidden text-slate-300 sm:inline dark:text-slate-600" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <Link
                    href={link.href}
                    className="rounded-lg px-3 py-2 font-medium text-slate-600 underline-offset-4 transition-colors duration-200 hover:bg-slate-100 hover:text-[#2563eb] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-sky-400"
                  >
                    {link.label}
                  </Link>
                </Fragment>
              ))}
            </nav>
            <p className="mt-8 mb-0 border-t border-slate-200/90 pt-6 text-sm dark:border-slate-700/80">
              <Link
                href="/blog"
                className="font-medium text-[#2563eb] underline-offset-4 transition-colors duration-200 hover:text-blue-700 hover:underline dark:text-sky-400 dark:hover:text-sky-300"
              >
                ← Voltar ao índice do blog
              </Link>
            </p>
          </div>
        </section>
      )}
    </article>
  );
}
