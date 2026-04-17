'use client';

import { cn } from '@/lib/utils';

interface AlarmRingingBannerProps {
  isRinging: boolean;
  onStop: () => void;
  className?: string;
}

/**
 * Indicador global: alarme ativo + botão para silenciar.
 */
export function AlarmRingingBanner({ isRinging, onStop, className }: AlarmRingingBannerProps) {
  if (!isRinging) return null;

  return (
    <div
      className={cn(
        'w-full max-w-md animate-pulse rounded-2xl border border-red-200/80 bg-red-50 px-5 py-4 text-center shadow-sm dark:border-red-900/50 dark:bg-red-950/40',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <p className="text-base font-semibold text-red-800 dark:text-red-200">⏰ Alarme tocando</p>
      <button
        type="button"
        onClick={onStop}
        className="mt-3 min-h-[44px] w-full rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500"
      >
        Parar alarme
      </button>
    </div>
  );
}
