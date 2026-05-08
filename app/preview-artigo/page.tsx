import type { Metadata } from 'next';
import { BlogArticleProse } from '@/components/blog-landing/BlogArticleProse';
import { getBlogArticleBySlug } from '@/lib/blog-articles';

const PREVIEW_SLUG = 'pomodoro';

export const metadata: Metadata = {
  title: 'Preview de artigo (layout)',
  description: 'Visualização interna para validar tipografia e leitura do artigo.',
  robots: { index: false, follow: false },
};

export default function PreviewArtigoPage() {
  const article = getBlogArticleBySlug(PREVIEW_SLUG);
  if (!article) {
    return (
      <div className="mx-auto max-w-[760px] px-4 py-16 sm:px-6">
        <p className="text-slate-600">Artigo não encontrado.</p>
      </div>
    );
  }

  return <BlogArticleProse article={article} variant="reading" />;
}
