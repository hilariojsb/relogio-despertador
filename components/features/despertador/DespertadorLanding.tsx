import type { ReactNode } from 'react';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, InfoCard, PageHeader } from '@/components/layout';
import ClockDisplay from '@/components/features/clock/ClockDisplay';
import AlarmManager from '@/components/features/alarm/AlarmManager';
import { SeoArticleBody } from '@/components/features/despertador/SeoArticleBody';
import type { SeoArticle } from '@/lib/seo/types';
import { cn } from '@/lib/utils';

export interface DespertadorLandingProps {
  pageHeader: {
    eyebrow: string;
    title?: string;
    description?: string;
  };
  /** Artigo longo para indexação (opcional na home hub) */
  seoArticle?: SeoArticle;
  howToTitle: string;
  howToItems: string[];
  /** Texto curto opcional após a ferramenta e antes do artigo */
  extraParagraph?: string;
  /** Conteúdo extra após o bloco principal (ex.: links internos SEO) */
  belowContent?: ReactNode;
  /** Blocos extras após o passo a passo (ex.: dicas + FAQ) */
  additionalSections?: ReactNode;
  className?: string;
}

export default function DespertadorLanding({
  pageHeader,
  seoArticle,
  howToTitle,
  howToItems,
  extraParagraph,
  belowContent,
  additionalSections,
  className,
}: DespertadorLandingProps) {
  return (
    <AppShell maxWidth="4xl" className={className}>
      <AdBanner slot="top" />

      <section className="space-y-4 text-center sm:space-y-6">
        <PageHeader
          eyebrow={pageHeader.eyebrow}
          title={pageHeader.title}
          description={pageHeader.description}
        />
        <div className="animate-fade-up py-2 sm:py-4">
          <ClockDisplay size="lg" showSeconds showDate={false} />
        </div>
      </section>

      <section className="animate-fade-up [animation-delay:40ms]">
        <AlarmManager />
      </section>

      {extraParagraph && (
        <p
          className={cn(
            'animate-fade-up text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-[15px]',
            '[animation-delay:60ms]'
          )}
        >
          {extraParagraph}
        </p>
      )}

      {seoArticle && <SeoArticleBody article={seoArticle} />}

      <AdBanner slot="middle" />

      <InfoCard title={howToTitle}>
        <ol className="list-inside list-decimal space-y-2">
          {howToItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </InfoCard>

      {additionalSections}

      <AdBanner slot="bottom" />

      {belowContent}
    </AppShell>
  );
}
