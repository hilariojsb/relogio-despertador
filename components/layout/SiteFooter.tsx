import Link from 'next/link';

const links = [
  { href: '/sobre', label: 'Sobre nós' },
  { href: '/contato', label: 'Contato' },
  { href: '/politica-de-privacidade', label: 'Política de Privacidade' },
  { href: '/termos-de-uso', label: 'Termos de Uso' },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="app-chrome-bottom mt-auto border-t border-[#E5EAF0] bg-transparent py-8 dark:border-slate-700"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 sm:gap-6">
        <nav aria-label="Links institucionais">
          <ul className="flex flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13px] text-[#64748B] transition-colors duration-200 hover:text-[#0F172A] sm:text-sm dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex w-full min-w-0 justify-center">
          <p className="max-w-full text-center text-[clamp(10px,2.45vw,13px)] font-normal tabular-nums leading-none tracking-tight text-[#64748B] whitespace-nowrap dark:text-slate-400">
            © {year} Relógio Despertador · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
