import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <section className={cn('glass-panel-strong animate-fade-up p-5 sm:p-6', className)}>
      <h2 className="mb-4 text-sm font-semibold text-foreground/90">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
