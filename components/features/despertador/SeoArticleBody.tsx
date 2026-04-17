import type { SeoArticle } from '@/lib/seo/types';
import { cn } from '@/lib/utils';

interface SeoArticleBodyProps {
  article: SeoArticle;
  className?: string;
}

/**
 * Artigo semântico para páginas programáticas (indexação / leitura).
 * Posicionado após a ferramenta: UX primeiro, conteúdo crawlável em seguida.
 */
export function SeoArticleBody({ article, className }: SeoArticleBodyProps) {
  if (!article.sections.length) return null;

  return (
    <article
      className={cn(
        'glass-panel-strong animate-fade-up space-y-8 p-6 text-left sm:p-8',
        '[animation-delay:80ms]',
        className
      )}
    >
      {article.sections.map((section, idx) => (
        <section key={idx} className="space-y-3">
          <h2 className="text-balance text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {section.heading}
          </h2>
          <div className="space-y-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {section.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
