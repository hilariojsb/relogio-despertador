'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { id: 'light' as const, label: 'Claro', icon: '☀️' },
  { id: 'dark' as const, label: 'Escuro', icon: '🌙' },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn('flex h-9 w-[7rem] animate-pulse rounded-full bg-muted md:w-[8rem]', className)}
        aria-hidden
      />
    );
  }

  const active = theme === 'system' || !theme ? 'light' : theme;

  return (
    <div
      className={cn(
        'inline-flex rounded-full border border-border bg-muted/60 p-0.5 shadow-sm',
        className
      )}
      role="group"
      aria-label="Tema da interface"
    >
      {OPTIONS.map(({ id, label, icon }) => {
        const isOn = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            title={label}
            className={cn(
              'relative flex min-h-[36px] min-w-[2.75rem] flex-1 items-center justify-center rounded-full px-2 text-sm transition-colors duration-200 md:min-w-[3.25rem]',
              isOn
                ? 'bg-card font-medium text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={isOn}
          >
            <span className="sr-only">{label}</span>
            <span aria-hidden className="select-none">
              {icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
