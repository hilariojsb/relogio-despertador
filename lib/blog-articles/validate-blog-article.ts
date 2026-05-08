import { proseStillContainsDevAbsoluteUrl, sanitizeBlogArticleProse } from '@/lib/blog-articles/blog-body-links';
import type { BlogArticle, MidArticleSectionIndex } from '@/lib/blog-articles/types';

const MID_ALLOWED: ReadonlySet<number> = new Set<MidArticleSectionIndex>([0, 1]);

export class BlogArticleValidationError extends Error {
  constructor(
    public readonly slug: string,
    message: string
  ) {
    super(`[blog:${slug}] ${message}`);
    this.name = 'BlogArticleValidationError';
  }
}

/**
 * Garante que o artigo segue o template obrigatório do blog.
 * Use apenas via `defineBlogArticle` ao criar/editar conteúdo.
 */
export function assertValidBlogArticle(article: BlogArticle): void {
  const { slug } = article;

  if (!article.title?.trim()) throw new BlogArticleValidationError(slug, 'Título obrigatório.');
  if (!article.description?.trim()) throw new BlogArticleValidationError(slug, 'Descrição obrigatória.');
  if (article.description.length > 160) {
    throw new BlogArticleValidationError(
      slug,
      `Meta description deve ter no máximo 160 caracteres (atual: ${article.description.length}).`
    );
  }
  if (article.tagline != null && article.tagline.trim().length > 0 && article.tagline.trim().length > 120) {
    throw new BlogArticleValidationError(
      slug,
      `tagline deve ter no máximo 120 caracteres (atual: ${article.tagline.trim().length}).`
    );
  }
  if (!article.category?.trim()) throw new BlogArticleValidationError(slug, 'Categoria obrigatória.');

  if (article.tags != null) {
    if (!Array.isArray(article.tags)) {
      throw new BlogArticleValidationError(slug, 'tags deve ser um array quando informado.');
    }
    const seen = new Set<string>();
    for (let i = 0; i < article.tags.length; i++) {
      const raw = article.tags[i];
      if (typeof raw !== 'string' || !raw.trim()) {
        throw new BlogArticleValidationError(slug, `tags[${i}] deve ser string não vazia.`);
      }
      const tag = raw.trim().toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) {
        throw new BlogArticleValidationError(
          slug,
          `tags[${i}] use apenas minúsculas, números e hífens (ex.: procrastinacao, foco).`
        );
      }
      if (seen.has(tag)) {
        throw new BlogArticleValidationError(slug, `Tag duplicada: "${tag}".`);
      }
      seen.add(tag);
    }
  }

  if (!Array.isArray(article.quickSummary) || article.quickSummary.length < 3 || article.quickSummary.length > 6) {
    throw new BlogArticleValidationError(
      slug,
      `quickSummary deve ter entre 3 e 6 itens (atual: ${article.quickSummary?.length ?? 0}).`
    );
  }
  for (let i = 0; i < article.quickSummary.length; i++) {
    const line = article.quickSummary[i]?.trim() ?? '';
    if (!line) {
      throw new BlogArticleValidationError(slug, `quickSummary[${i}] não pode ser vazio.`);
    }
    if (line.length > 260) {
      throw new BlogArticleValidationError(
        slug,
        `quickSummary[${i}] deve ter no máximo 260 caracteres (atual: ${line.length}).`
      );
    }
  }

  if (!article.publishedAt?.trim()) {
    throw new BlogArticleValidationError(slug, 'Data publishedAt obrigatória (ISO YYYY-MM-DD).');
  }

  if (article.intro.length < 2 || article.intro.length > 3) {
    throw new BlogArticleValidationError(
      slug,
      `Introdução deve ter 2 ou 3 parágrafos (atual: ${article.intro.length}).`
    );
  }

  if (article.sections.length < 4) {
    throw new BlogArticleValidationError(
      slug,
      `Mínimo 4 seções H2 (atual: ${article.sections.length}).`
    );
  }

  if (!article.conclusion?.length) {
    throw new BlogArticleValidationError(slug, 'Conclusão obrigatória (ao menos um parágrafo).');
  }

  if (!article.heroImage?.alt?.trim()) {
    throw new BlogArticleValidationError(slug, 'heroImage.alt obrigatório (acessibilidade e tema do placeholder).');
  }

  if (!article.midArticleImage?.alt?.trim()) {
    throw new BlogArticleValidationError(slug, 'midArticleImage.alt obrigatório.');
  }

  if (!MID_ALLOWED.has(article.midArticleImage.afterSectionIndex)) {
    throw new BlogArticleValidationError(
      slug,
      'midArticleImage.afterSectionIndex deve ser 0 (após 1ª seção) ou 1 (após 2ª).'
    );
  }

  for (let i = 0; i < article.sections.length; i++) {
    const s = article.sections[i];
    if (!s.h2?.trim()) {
      throw new BlogArticleValidationError(slug, `Seção ${i}: H2 obrigatório.`);
    }
    if (!s.paragraphs?.length) {
      throw new BlogArticleValidationError(slug, `Seção ${i}: ao menos um parágrafo.`);
    }
  }
}

export function defineBlogArticle(article: BlogArticle): BlogArticle {
  const normalized = sanitizeBlogArticleProse(article);
  assertValidBlogArticle(normalized);
  if (proseStillContainsDevAbsoluteUrl(normalized)) {
    throw new BlogArticleValidationError(
      normalized.slug,
      'Ainda há URL absoluta para ambiente local no texto — use apenas caminhos relativos (/…).',
    );
  }
  return normalized;
}
