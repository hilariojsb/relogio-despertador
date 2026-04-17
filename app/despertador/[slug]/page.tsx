import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlarmSeoTipsAndFaq } from '@/components/features/despertador/AlarmSeoTipsAndFaq';
import DespertadorLanding from '@/components/features/despertador/DespertadorLanding';
import { SITE_URL } from '@/lib/constants/site';
import {
  buildDespertadorCanonical,
  DESPERTADOR_SEO_VARIANTS,
  getDespertadorSeoBySlug,
  type DespertadorSeoVariant,
} from '@/lib/seo/despertador-keywords';

const SITE = SITE_URL;

export const dynamicParams = false;

export function generateStaticParams() {
  return DESPERTADOR_SEO_VARIANTS.map(v => ({ slug: v.slug }));
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const v = getDespertadorSeoBySlug(params.slug);
  if (!v) return {};
  const canonical = buildDespertadorCanonical(v.slug);
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    keywords: v.keywords,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical },
    openGraph: {
      title: v.metaTitle,
      description: v.metaDescription,
      url: canonical,
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Relógio Despertador',
    },
    twitter: {
      card: 'summary',
      title: v.metaTitle,
      description: v.metaDescription,
    },
  };
}

function jsonLdGraph(v: DespertadorSeoVariant) {
  const canonical = buildDespertadorCanonical(v.slug);
  const webpageId = `${canonical}#webpage`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'Relógio Despertador',
        url: SITE,
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: canonical,
        name: v.h1,
        description: v.metaDescription,
        isPartOf: { '@id': `${SITE}/#website` },
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Article',
        headline: v.h1,
        description: v.metaDescription,
        url: canonical,
        inLanguage: 'pt-BR',
        mainEntityOfPage: { '@id': webpageId },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: SITE,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Despertador',
            item: `${SITE}/despertador`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: v.h1,
            item: canonical,
          },
        ],
      },
    ],
  };
}

export default function DespertadorSeoPage({ params }: PageProps) {
  const v = getDespertadorSeoBySlug(params.slug);
  if (!v) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph(v)) }}
      />
      <DespertadorLanding
        pageHeader={{
          eyebrow: v.eyebrow,
          title: v.h1,
          description: v.intro,
        }}
        seoArticle={v.seoArticle}
        howToTitle={v.howToTitle}
        howToItems={v.howToItems}
        extraParagraph={v.extraParagraph}
        additionalSections={<AlarmSeoTipsAndFaq />}
      />
    </>
  );
}
