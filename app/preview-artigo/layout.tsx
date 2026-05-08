'use client';

import { useEffect } from 'react';

/**
 * Preview isolado para validar tipografia e leitura do artigo.
 * Remove temporariamente nav, rodapé e banner de cookies (via classe no documento).
 */
export default function PreviewArtigoLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    const hadDark = html.classList.contains('dark');
    html.classList.remove('dark');
    html.classList.add('preview-article-focus');
    document.body.classList.add('preview-article-focus');

    return () => {
      html.classList.remove('preview-article-focus');
      document.body.classList.remove('preview-article-focus');
      if (hadDark) html.classList.add('dark');
    };
  }, []);

  return (
    <div className="preview-article-root min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased">{children}</div>
  );
}
