/** Bloco editorial para páginas programáticas (SEO / indexação). */
export type SeoArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type SeoArticle = {
  sections: SeoArticleSection[];
};
