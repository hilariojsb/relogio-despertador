import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { normalizeBlogContentHref, sanitizeBlogBodyText } from '@/lib/blog-articles/blog-body-links';

const strongClass =
  'font-semibold text-slate-900 dark:text-white';

const linkClass =
  'font-medium text-[#2563eb] underline decoration-slate-300 underline-offset-2 transition-colors hover:decoration-[#2563eb] dark:text-sky-400 dark:decoration-slate-600 dark:hover:decoration-sky-400';

function renderBoldSegments(text: string): ReactNode[] {
  const re = /\*\*([^*]+)\*\*/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<Fragment key={`p-${k++}`}>{text.slice(last, m.index)}</Fragment>);
    }
    out.push(
      <strong key={`s-${k++}`} className={strongClass}>
        {m[1]}
      </strong>
    );
    last = re.lastIndex;
  }
  if (last < text.length) {
    out.push(<Fragment key={`p-${k++}`}>{text.slice(last)}</Fragment>);
  }
  return out.length > 0 ? out : [<Fragment key="p0">{text}</Fragment>];
}

type Piece =
  | { kind: 'text'; value: string }
  | { kind: 'link'; label: string; href: string; external: boolean };

function splitByMarkdownLinks(text: string): Piece[] {
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  const pieces: Piece[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > last) {
      pieces.push({ kind: 'text', value: text.slice(last, m.index) });
    }
    const normalized = normalizeBlogContentHref(m[2].trim());
    pieces.push({
      kind: 'link',
      label: m[1],
      href: normalized.href,
      external: normalized.external,
    });
    last = linkRe.lastIndex;
  }
  if (last < text.length) {
    pieces.push({ kind: 'text', value: text.slice(last) });
  }
  if (pieces.length === 0) {
    pieces.push({ kind: 'text', value: text });
  }
  return pieces;
}

/**
 * Interpreta links Markdown internos `[rótulo](/caminho)` e negrito `**trecho**` dentro de um parágrafo ou lista.
 * URLs absolutas do próprio site ou do ambiente de desenvolvimento viram caminhos relativos.
 */
export function ParagraphBody({ text }: { text: string }) {
  const cleaned = sanitizeBlogBodyText(text);
  const pieces = splitByMarkdownLinks(cleaned);
  return (
    <>
      {pieces.map((p, i) =>
        p.kind === 'link' ? (
          p.external ? (
            <a
              key={i}
              href={p.href}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.label}
            </a>
          ) : (
            <Link key={i} href={p.href} className={linkClass}>
              {p.label}
            </Link>
          )
        ) : (
          <Fragment key={i}>{renderBoldSegments(p.value)}</Fragment>
        )
      )}
    </>
  );
}
