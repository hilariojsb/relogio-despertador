'use client';

import { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ClockDisplayProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSeconds?: boolean;
  showDate?: boolean;
  isRinging?: boolean;
}

const sizeClasses: Record<NonNullable<ClockDisplayProps['size']>, string> = {
  sm: 'text-4xl sm:text-5xl',
  md: 'text-5xl sm:text-6xl md:text-7xl',
  lg: 'text-6xl sm:text-7xl md:text-8xl',
  xl: 'text-7xl sm:text-8xl md:text-[9rem]',
};

function ClockDisplayInner({
  size = 'xl',
  showSeconds = true,
  showDate = true,
  isRinging = false,
}: ClockDisplayProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div
        className={cn(
          'clock-digit select-none font-bold tabular-nums text-transparent',
          sizeClasses[size]
        )}
        aria-hidden
      >
        --:--:--
      </div>
    );
  }

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const dateStr = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        className={cn(
          'clock-digit font-bold tabular-nums leading-none text-[var(--text)] transition-colors duration-300',
          sizeClasses[size]
        )}
        suppressHydrationWarning
      >
        {hours}
        <span
          className={cn(
            'transition-opacity duration-300',
            isRinging ? 'opacity-100' : 'opacity-55'
          )}
        >
          :
        </span>
        {minutes}
        {showSeconds && (
          <>
            <span
              className={cn(
                'transition-opacity duration-300',
                isRinging ? 'opacity-100' : 'opacity-55'
              )}
            >
              :
            </span>
            <span
              className={cn(
                'text-muted-foreground',
                size === 'xl' && 'text-4xl sm:text-6xl md:text-7xl'
              )}
            >
              {seconds}
            </span>
          </>
        )}
      </div>
      {showDate && (
        <p
          className="max-w-[90vw] text-center text-xs text-muted-foreground capitalize sm:text-sm"
          suppressHydrationWarning
        >
          {dateStr}
        </p>
      )}
    </div>
  );
}

export const ClockDisplay = memo(ClockDisplayInner);
export default ClockDisplay;
