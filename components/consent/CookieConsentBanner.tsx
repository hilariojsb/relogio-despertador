'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { COOKIE_CONSENT_STORAGE_KEY } from '@/lib/constants/site';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/90 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p id="cookie-consent-title" className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Este site utiliza cookies para melhorar a experiência e exibir anúncios relevantes.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href="/politica-de-privacidade#cookies-anuncios"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Gerenciar
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
