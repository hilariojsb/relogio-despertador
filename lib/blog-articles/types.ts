export type ArticleSubsection = {
  h3: string;
  paragraphs: string[];
  list?: string[];
};

export type BlogArticleHighlight = {
  variant: 'tip' | 'warning';
  body: string;
};

export type ArticleSection = {
  h2: string;
  paragraphs: string[];
  list?: string[];
  subsections?: ArticleSubsection[];
  /** Caixas 💡 Dica / ⚠️ Erro comum (template editorial). */
  highlights?: BlogArticleHighlight[];
};

/** Slot de imagem: com `src`, exibe figura; sem `src`, placeholder 16:9. */
export type BlogArticleImageSlot = {
  alt: string;
  src?: string;
};

/** Índice da seção após a qual a figura interna é exibida (1ª = 0, 2ª = 1). */
export type MidArticleSectionIndex = 0 | 1;

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  /** Frase curta de impacto abaixo do título (opcional; máx. 120 caracteres no validador). */
  tagline?: string;
  publishedAt: string;
  /** Mantido para analytics/SEO interno; na UI usamos rótulos “Leitura rápida” e “Guia prático”. */
  readMinutes: number;
  category: string;
  /**
   * Tags de intenção / cluster (ex.: procrastinação, foco). Opcional.
   * Slugs estáveis em minúsculas; alinhar a `BLOG_INTENT_TAG_IDS` quando for intenção da landing.
   */
  tags?: string[];
  /**
   * 3 a 6 tópicos para o bloco “Resumo rápido” no topo do artigo (retenção e escaneabilidade).
   */
  quickSummary: string[];
  /** 2 a 3 parágrafos (validado em `defineBlogArticle`). */
  intro: string[];
  /** Mínimo 4 seções H2 (validado). */
  sections: ArticleSection[];
  conclusion: string[];
  /** Palavras-chave opcionais para meta/SEO. */
  keywords?: string[];
  /** Dica final opcional (bloco destacado antes do rodapé de ferramentas). */
  tip?: string;
  /** Topo: imagem real ou placeholder obrigatório (sempre presente com `alt`). */
  heroImage: BlogArticleImageSlot;
  /** Figura após a 1ª ou 2ª seção: imagem ou placeholder. */
  midArticleImage: BlogArticleImageSlot & { afterSectionIndex: MidArticleSectionIndex };
};
