import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogArticleExploreTracker } from '@/components/blog-landing/BlogArticleExploreTracker';
import { BlogArticleProse } from '@/components/blog-landing/BlogArticleProse';
import { BlogArticleSidebar } from '@/components/blog-landing/BlogArticleSidebar';
import { AppShell } from '@/components/layout';
import { getAllBlogSlugs, getBlogArticleBySlug, getArticleJsonLd, getRelatedBlogArticles } from '@/lib/blog-articles';
import { resolvePublicAssetUrl, SITE_URL } from '@/lib/constants/site';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getBlogArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Artigo' };
  }
  const url = `${SITE_URL}/blog/${article.slug}`;
  const ogImage = article.heroImage.src
    ? [{ url: resolvePublicAssetUrl(article.heroImage.src), width: 1200, height: 675 }]
    : undefined;
  const keywords = article.keywords?.length
    ? article.keywords
    : [article.category, 'relógio online', 'despertador online', 'produtividade'];

  return {
    title: article.title,
    description: article.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      url,
      locale: 'pt_BR',
      ...(ogImage ? { images: ogImage } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      ...(article.heroImage.src ? { images: [resolvePublicAssetUrl(article.heroImage.src)] } : {}),
    },
  };
}

export default function BlogArticlePage({ params }: Props) {
  const article = getBlogArticleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = getArticleJsonLd(article);
  const related = getRelatedBlogArticles(article, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticleExploreTracker
        slug={article.slug}
        title={article.title}
        articleCategoryLabel={article.category}
      />
      <AppShell
        maxWidth="6xl"
        className="!max-w-[1280px] space-y-0 px-4 pb-24 pt-8 sm:px-6 sm:pt-10"
      >
        {/*
          Grid editorial: coluna central recebe foco no topo (trilha + cabeçalho + resumo + hero + introdução).
          A sidebar só entra no fluxo visual mais abaixo (≈ após bloco inicial), com sticky a partir daí —
          evita competir com título e gancho do artigo.
        */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_minmax(720px,800px)_300px] xl:items-start xl:gap-x-6 xl:gap-y-0">
          <div className="hidden min-w-0 xl:block" aria-hidden />
          <div className="min-w-0 justify-self-stretch">
            <nav className="mb-8 px-4 text-sm text-[#64748b]" aria-label="Trilha">
              <Link href="/blog" className="font-medium text-[#2563eb] hover:underline">
                Blog
              </Link>
              <span className="mx-2 text-slate-400" aria-hidden>
                /
              </span>
              <span className="text-slate-600 dark:text-slate-300">Artigo</span>
            </nav>
            <BlogArticleProse article={article} fluidColumn />
          </div>
          <div className="hidden min-w-0 shrink-0 xl:block xl:w-[300px]">
            <BlogArticleSidebar
              current={article}
              related={related}
              className={[
                /* sticky + self-start: comportamento correto em grelha */
                'sticky top-24 self-start',
                /* começa após cabeçalho + resumo + hero + intro (~ zona da 1.ª imagem / gancho) */
                'xl:mt-[clamp(17rem,46vh,39rem)]',
                /* respiro e hierarquia: linha suave marca “apoio”, não competição com o hero */
                'xl:border-t xl:border-slate-200/85 xl:pt-8 dark:xl:border-slate-700/55',
              ].join(' ')}
            />
          </div>
        </div>
      </AppShell>
    </div>
  );
}
