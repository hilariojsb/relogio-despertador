'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FAQ_ITEMS } from '@/components/blog-landing/data';
import { cn } from '@/lib/utils';

export function BlogFaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="space-y-5" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white"
      >
        Perguntas frequentes
      </h2>
      <ul className="space-y-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={item.q}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-[#64748b] transition-transform',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-[#64748b] dark:border-slate-700/50">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <Link href="/blog#faq-heading" className="inline-block text-sm font-semibold text-[#2563eb] hover:underline">
        Ver todas as perguntas →
      </Link>
    </section>
  );
}
