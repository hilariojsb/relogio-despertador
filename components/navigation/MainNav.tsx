'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl transition-colors duration-300 supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto max-w-7xl px-4 sm:px-5">
          <div className="flex h-14 min-h-[3.5rem] items-center justify-between gap-3">
            <Link
              href="/"
              className="group flex min-h-[44px] min-w-[44px] items-center rounded-xl py-1 pr-2 -ml-1 pl-1 transition-colors hover:bg-muted/80 sm:min-h-0 sm:min-w-0 sm:py-0"
            >
              <span className="text-[12px] font-semibold leading-tight tracking-tight sm:text-[15px]">
                <span className="text-foreground">Relógio </span>
                <span className="text-primary">Despertador</span>
              </span>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-0.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active = isNavActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200',
                        active
                          ? 'bg-primary/15 text-primary shadow-sm shadow-primary/10 ring-1 ring-primary/25'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 opacity-90" aria-hidden />
                      {label}
                    </Link>
                  );
                })}
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(v => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-panel"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 animate-nav-backdrop bg-foreground/25 backdrop-blur-[2px] dark:bg-black/50 md:hidden"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="fixed inset-x-0 top-14 z-50 max-h-[min(70vh,calc(100dvh-3.5rem))] overflow-y-auto border-b border-border bg-background/98 px-4 py-4 shadow-xl animate-slide-down backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-1.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isNavActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
