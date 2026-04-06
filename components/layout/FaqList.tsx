export interface FaqItemData {
  question: string;
  answer: string;
}

interface FaqListProps {
  items: FaqItemData[];
}

/**
 * Lista de FAQ com hierarquia clara: pergunta (h3) + resposta (p), um bloco por item.
 */
export function FaqList({ items }: FaqListProps) {
  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <div
          key={index}
          className="mb-6 border-b border-[#E5EAF0] pb-6 last:mb-0 last:border-b-0 last:pb-0 dark:border-slate-700"
        >
          <h3 className="flex items-start gap-2.5 text-[15px] font-semibold leading-snug text-[#0F172A] dark:text-slate-100 sm:text-base">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-bold text-primary"
              aria-hidden
            >
              Q
            </span>
            <span className="min-w-0 pt-0.5">{item.question}</span>
          </h3>
          <p className="mt-2 max-w-none pl-8 text-sm leading-relaxed text-[#64748B] dark:text-slate-400 sm:pl-[2.125rem]">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}
