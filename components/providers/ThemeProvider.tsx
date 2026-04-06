'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'theme';

function migrateLegacySystemTheme() {
  if (typeof window === 'undefined') return;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'system') {
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  migrateLegacySystemTheme();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      themes={['light', 'dark']}
      storageKey={STORAGE_KEY}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
