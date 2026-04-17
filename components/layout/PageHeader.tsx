import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  /** Título principal (H1). Se omitido, o eyebrow vira o H1. */
  title?: string;
  description?: string;
  className?: string;
  align?: 'center' | 'start';
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
}: PageHeaderProps) {
  const h1Text = title ?? eyebrow;
  const showEyebrowLine = Boolean(title);

  return (
    <header
      className={cn(
        'space-y-2 animate-fade-up',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {showEyebrowLine && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">{h1Text}</h1>
      {description && (
        <p className="mx-auto max-w-lg text-pretty text-sm text-muted-foreground sm:text-[15px]">
          {description}
        </p>
      )}
    </header>
  );
}
