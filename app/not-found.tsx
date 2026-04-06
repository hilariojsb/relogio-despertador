import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';

export default function NotFound() {
  return (
    <AppShell maxWidth="3xl" className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Erro 404</p>
      <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
        O endereço pode ter sido digitado incorretamente ou a página foi movida. Volte à página inicial para
        continuar usando o relógio e as ferramentas.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        Voltar para a página inicial
      </Link>
    </AppShell>
  );
}
