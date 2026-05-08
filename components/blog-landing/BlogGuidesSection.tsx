import Link from 'next/link';
import { AlarmClock, ChevronRight } from 'lucide-react';
import { GUIDE_ITEMS } from '@/components/blog-landing/data';

export function BlogGuidesSection() {
  return (
    <section id="comece-agora" className="scroll-mt-24 space-y-6" aria-labelledby="comece-agora-heading">
      <div>
        <h2
          id="comece-agora-heading"
          className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
        >
          Comece agora
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#64748b] sm:text-base">
          Atalhos no despertador para intervalos em minutos (5, 10, 15, 30, 45, 60 e páginas relacionadas). Use quando
          já sabe quanto tempo quer — e quer disparar o alarme sem passos extras.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {GUIDE_ITEMS.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-[#2563eb]/25 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/40"
              style={{ borderRadius: '14px' }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb]"
                aria-hidden
              >
                <AlarmClock className="h-6 w-6" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 group-hover:text-[#2563eb] dark:text-white dark:group-hover:text-blue-400">
                  {g.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-[#64748b]">{g.desc}</p>
              </div>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-[#94a3b8] transition group-hover:translate-x-0.5 group-hover:text-[#2563eb]"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-center">
        <Link href="/despertador" className="text-sm font-semibold text-[#2563eb] hover:underline">
          Ver todos os atalhos →
        </Link>
      </p>
    </section>
  );
}
