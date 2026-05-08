import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function BlogEvolucaoCtaSection() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 text-white shadow-lg sm:p-10 dark:border-slate-600"
      style={{ borderRadius: '16px' }}
      aria-labelledby="evolucao-cta-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#2563eb]/25 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            <Sparkles className="h-4 w-4 text-sky-300" aria-hidden />
            Próximo nível
          </p>
          <h2 id="evolucao-cta-heading" className="mt-3 text-2xl font-bold leading-tight sm:text-[1.75rem]">
            Siga evoluindo com ferramentas gratuitas
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            O blog mostra o caminho; as ferramentas ajudam você a manter o ritmo todos os dias — sem instalar
            nada, direto no navegador.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/pomodoro"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-sky-100"
          >
            Pomodoro online
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/despertador"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Despertador
          </Link>
        </div>
      </div>
    </section>
  );
}
