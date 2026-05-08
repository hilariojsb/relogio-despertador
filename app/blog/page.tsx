import type { Metadata } from 'next';
import { AppShell } from '@/components/layout';
import { BlogLandingView } from '@/components/blog-landing';
import { FEATURED_POSTS } from '@/components/blog-landing/data';
import { ROTATION_INTERVAL_MS } from '@/components/blog-landing/featured-rotation';
import { popularRotationBucketFromTimestamp } from '@/components/blog-landing/popular-rotation';
import { debugLog, debugTable, debugWarn } from '@/lib/dev-debug';
import {
  auditArticles,
  countByCategory,
  countByTag,
  getAllBlogArticles,
  getBlogCategoryCountsFromArticles,
  normalizeArticles,
  type ArticleAuditIssue,
} from '@/lib/blog-articles';

export const metadata: Metadata = {
  title: 'Blog — dicas de produtividade, tempo e ferramentas',
  description:
    'Hub de conteúdo sobre produtividade, foco, rotina, estudos e gestão do tempo. Guias, busca, Pomodoro e despertador online gratuitos.',
};

/** Logs de auditoria no terminal (dev): defina DEBUG_BLOG_AUDIT=1 no `.env.local`. */
const ENABLE_AUDIT_LOG = process.env.DEBUG_BLOG_AUDIT === '1';

/** Evita repetir a mesma saída quando o módulo é reavaliado várias vezes no dev. */
let blogAuditTerminalLogged = false;

/** Slugs dos posts em destaque no hub — mesma base da lista principal e das contagens da sidebar. */
function featuredHubSlugs(): Set<string> {
  return new Set(
    FEATURED_POSTS.map((p) => (p.href.startsWith('/blog/') ? p.href.slice('/blog/'.length) : p.href)),
  );
}

export default function BlogPage() {
  const rawArticles = getAllBlogArticles();
  const normalizedArticles = normalizeArticles(rawArticles);
  const hubSlugs = featuredHubSlugs();
  const hubBaseArticles = normalizedArticles.filter((a) => hubSlugs.has(a.slug));
  const categoryCounts = getBlogCategoryCountsFromArticles(hubBaseArticles);

  const auditIssues = auditArticles(normalizedArticles);

  let devAuditIssues: ArticleAuditIssue[] | undefined;
  if (process.env.NODE_ENV === 'development' && auditIssues.length > 0) {
    devAuditIssues = auditIssues;
  }

  if (
    process.env.NODE_ENV === 'development' &&
    ENABLE_AUDIT_LOG &&
    !blogAuditTerminalLogged
  ) {
    blogAuditTerminalLogged = true;
    debugLog('[blog] AUDITORIA DE ARTIGOS:', auditIssues);
    if (auditIssues.length > 0) {
      debugWarn('[blog] Problemas encontrados:', auditIssues);
    }
    debugTable(countByCategory(normalizedArticles));
    debugTable(countByTag(normalizedArticles));
  }

  const articlesTagMeta = normalizedArticles.map((a) => ({
    slug: a.slug,
    tags: a.tags,
  }));

  const initialRotationBucket = Math.floor(Date.now() / ROTATION_INTERVAL_MS);
  const initialPopularRotationBucket = popularRotationBucketFromTimestamp(Date.now());

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950">
      <AppShell
        maxWidth="6xl"
        className="!max-w-[1200px] space-y-0 px-4 pb-20 pt-8 sm:pb-24 sm:pt-10"
      >
        <BlogLandingView
          initialRotationBucket={initialRotationBucket}
          initialPopularRotationBucket={initialPopularRotationBucket}
          categoryCounts={categoryCounts}
          articlesTagMeta={articlesTagMeta}
          devAuditIssues={devAuditIssues}
        />
      </AppShell>
    </div>
  );
}
