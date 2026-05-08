'use client';

import type { ArticleAuditIssue } from '@/lib/blog-articles';

type BlogDevAuditBannerProps = {
  issues: ArticleAuditIssue[];
};

/** Visível só quando o servidor envia issues em modo desenvolvimento. */
export function BlogDevAuditBanner({ issues }: BlogDevAuditBannerProps) {
  if (!issues.length) return null;

  const critical = issues.filter((i) => i.severity === 'critical').length;
  const preview = issues.slice(0, 5);

  return (
    <div
      role="status"
      className="mb-8 rounded-xl border border-amber-400/90 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm dark:border-amber-500/55 dark:bg-amber-950/45 dark:text-amber-50"
    >
      <p className="font-semibold text-amber-900 dark:text-amber-100">[Dev] Auditoria de artigos</p>
      <p className="mt-1 leading-snug">
        {issues.length} problema(s) detectado(s), sendo <strong>{critical}</strong> crítico(s). Detalhes no{' '}
        <strong className="font-semibold">terminal do servidor</strong> (console ao renderizar <code className="rounded bg-amber-100/80 px-1 py-0.5 text-xs dark:bg-amber-900/80">/blog</code>
        ).
      </p>
      <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs opacity-95">
        {preview.map((issue, i) => (
          <li key={`${issue.slug}-${issue.type}-${issue.tag ?? ''}-${i}`}>
            <span className="font-medium">{issue.type}</span>
            <span className="text-amber-800 dark:text-amber-200">
              {' '}
              — {issue.slug}
              {issue.tag != null ? ` (${issue.tag})` : ''}
            </span>
          </li>
        ))}
      </ul>
      {issues.length > preview.length ? (
        <p className="mt-2 text-xs opacity-90">… e mais {issues.length - preview.length} registro(s).</p>
      ) : null}
    </div>
  );
}
