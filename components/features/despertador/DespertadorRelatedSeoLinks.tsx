import Link from 'next/link';
import { DESPERTADOR_SEO_VARIANTS } from '@/lib/seo/despertador-keywords';

export function DespertadorRelatedSeoLinks() {
  return (
    <nav
      className="glass-panel rounded-2xl p-5 sm:p-6"
      aria-label="Páginas sobre despertador e palavras-chave"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Buscas relacionadas
      </p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {DESPERTADOR_SEO_VARIANTS.map(v => (
          <li key={v.slug}>
            <Link
              href={`/despertador/${v.slug}`}
              className="block rounded-lg py-1.5 text-sm text-primary transition-colors hover:text-primary/85 hover:underline"
            >
              {v.h1}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
