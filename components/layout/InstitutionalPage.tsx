import { AppShell } from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';

export function InstitutionalPage({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AppShell maxWidth="4xl" className={cn('!space-y-0 pt-8 sm:pt-10 md:pt-12', className)}>
      <article className="mx-auto w-full max-w-[760px] px-1 sm:px-0">
        <h1 className="mb-8 text-balance text-3xl font-semibold tracking-tight text-[#0F172A] dark:text-slate-100 md:mb-10 md:text-4xl">
          {title}
        </h1>
        <div className="space-y-10 md:space-y-12">{children}</div>
      </article>
    </AppShell>
  );
}

export function InstitutionalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-[#0F172A] dark:text-slate-100">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-[#64748B] dark:text-slate-400">
        {children}
      </div>
    </section>
  );
}
