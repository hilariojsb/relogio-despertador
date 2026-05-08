import { articleAcordarHorarioCerto } from '@/lib/blog-articles/article-acordar-horario-certo';
import { articleComoAcordarCedo } from '@/lib/blog-articles/article-como-acordar-cedo';
import { articleComoAprenderMelhor } from '@/lib/blog-articles/article-como-aprender-melhor';
import { articleComoEstudarComFoco } from '@/lib/blog-articles/article-como-estudar-com-foco';
import { articleComoManterConsistencia } from '@/lib/blog-articles/article-como-manter-consistencia';
import { articleComoPararDeProcrastinar } from '@/lib/blog-articles/article-como-parar-de-procrastinar';
import { articleComoMemorizarMaisRapido } from '@/lib/blog-articles/article-como-memorizar-mais-rapido';
import { articleComoRevisarConteudo } from '@/lib/blog-articles/article-como-revisar-conteudo';
import { articleComoVencerAPreguica } from '@/lib/blog-articles/article-como-vencer-a-preguica';
import { articleCriarRotinaDiaria } from '@/lib/blog-articles/article-criar-rotina-diaria';
import { articleDespertadorEstudar } from '@/lib/blog-articles/article-despertador-estudar';
import { articleDisciplinaPlanejamento } from '@/lib/blog-articles/article-disciplina-planejamento';
import { articleErrosNoPomodoro } from '@/lib/blog-articles/article-erros-no-pomodoro';
import { articleHabitosProdutivos } from '@/lib/blog-articles/article-habitos-produtivos';
import { articleIntervalo10Minutos } from '@/lib/blog-articles/article-intervalo-10-minutos';
import { articleIntervaloIdealEstudo } from '@/lib/blog-articles/article-intervalo-ideal-estudo';
import { articleLembretes5Min } from '@/lib/blog-articles/article-alarmes-5min';
import { articlePomodoro } from '@/lib/blog-articles/article-pomodoro';
import { articlePomodoroVsMultitarefa } from '@/lib/blog-articles/article-pomodoro-vs-multitarefa';
import { articlePorQueProcrastinamos } from '@/lib/blog-articles/article-por-que-procrastinamos';
import { articleQuantosPomodorosPorDia } from '@/lib/blog-articles/article-quantos-pomodoros-por-dia';
import { articleQuantoTempoEstudarPorDia } from '@/lib/blog-articles/article-quanto-tempo-estudar-por-dia';
import { articleRotinaMatinalIdeal } from '@/lib/blog-articles/article-rotina-matinal-ideal';
import { articleTecnicasDeEstudoQueFuncionam } from '@/lib/blog-articles/article-tecnicas-de-estudo-que-funcionam';
import type { BlogArticle } from '@/lib/blog-articles/types';
import { assertValidBlogArticle } from '@/lib/blog-articles/validate-blog-article';

/** Ordem editorial: uma página por slug, sem duplicar temas. */
const ARTICLES: BlogArticle[] = [
  articlePomodoro,
  articleErrosNoPomodoro,
  articlePomodoroVsMultitarefa,
  articleQuantosPomodorosPorDia,
  articleHabitosProdutivos,
  articleComoPararDeProcrastinar,
  articlePorQueProcrastinamos,
  articleComoVencerAPreguica,
  articleComoManterConsistencia,
  articleIntervaloIdealEstudo,
  articleQuantoTempoEstudarPorDia,
  articleComoRevisarConteudo,
  articleComoEstudarComFoco,
  articleComoMemorizarMaisRapido,
  articleTecnicasDeEstudoQueFuncionam,
  articleComoAprenderMelhor,
  articleComoAcordarCedo,
  articleAcordarHorarioCerto,
  articleCriarRotinaDiaria,
  articleRotinaMatinalIdeal,
  articleLembretes5Min,
  articleIntervalo10Minutos,
  articleDespertadorEstudar,
  articleDisciplinaPlanejamento,
];

for (const article of ARTICLES) {
  assertValidBlogArticle(article);
}

const bySlug = new Map(ARTICLES.map((a) => [a.slug, a]));

/** Rotulação consistente: trim + primeira maiúscula (pt-BR), resto minúsculo. */
function normalizeBlogCategoryLabel(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  const lower = t.toLocaleLowerCase('pt-BR');
  return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
}

/** Slug alinhado a `categorySlug` da landing (sem acentos, minúsculo). */
function blogCategoryLabelToSlug(label: string): string {
  return label
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export type BlogCategoryCountRow = {
  label: string;
  slug: string;
  count: number;
};

/** Contagem por categoria a partir de uma lista arbitrária de artigos (ex.: só hub em destaque). */
export function getBlogCategoryCountsFromArticles(articles: BlogArticle[]): BlogCategoryCountRow[] {
  const acc = new Map<string, number>();
  for (const article of articles) {
    const label = normalizeBlogCategoryLabel(article.category);
    if (!label) continue;
    acc.set(label, (acc.get(label) ?? 0) + 1);
  }
  return Array.from(acc.entries())
    .map(([label, count]) => ({
      label,
      slug: blogCategoryLabelToSlug(label),
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
}

/** Contagem por categoria — todos os artigos publicados no acervo. */
export function getBlogCategoryCounts(): BlogCategoryCountRow[] {
  return getBlogCategoryCountsFromArticles(ARTICLES);
}

export function getAllBlogArticles(): BlogArticle[] {
  return ARTICLES;
}

export function getAllBlogSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return bySlug.get(slug);
}

/** Mesma categoria primeiro; exclui o artigo atual. */
export function getRelatedBlogArticles(current: BlogArticle, limit = 4): BlogArticle[] {
  const others = ARTICLES.filter((a) => a.slug !== current.slug);
  const sameCat = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...sameCat, ...rest].slice(0, Math.max(0, limit));
}

export type {
  BlogArticle,
  BlogArticleHighlight,
  BlogArticleImageSlot,
} from '@/lib/blog-articles/types';
export type { BlogIntentTagId } from '@/lib/blog-articles/blog-intent-tags';
export {
  BLOG_INTENT_GOALS,
  BLOG_INTENT_TAG_IDS,
  BLOG_INTENT_TAG_LABELS,
} from '@/lib/blog-articles/blog-intent-tags';
export { filterByTag, filterByTags } from '@/lib/blog-articles/filter-by-tag';
export {
  auditArticles,
  countAuditCriticalIssues,
  countByCategory,
  countByTag,
  normalizeArticles,
} from '@/lib/blog-articles/audit-articles';
export type {
  ArticleAuditIssue,
  ArticleAuditIssueType,
  ArticleAuditSeverity,
} from '@/lib/blog-articles/audit-articles';
export { defineBlogArticle, assertValidBlogArticle, BlogArticleValidationError } from '@/lib/blog-articles/validate-blog-article';
export { getArticleJsonLd } from '@/lib/blog-articles/article-json-ld';
