'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { getWallClockPartsInZone } from '@/lib/accurate-world-time';
import { cn } from '@/lib/utils';

export interface ClockDisplayProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSeconds?: boolean;
  showDate?: boolean;
  isRinging?: boolean;
  /** HH:MM em destaque, :ss menores (ex.: home hero) */
  timeVariant?: 'default' | 'homeHero';
  /** Ex.: "Horário de Brasília (GMT-3)" — em homeHero, linha abaixo da data */
  footerTimezone?: string;
  /** Larger digits for card fullscreen / focus mode (homeHero only). */
  isFullscreen?: boolean;
  /**
   * Instant UTC sincronizado (rede). Com `displayTimeZone`, a hora não usa o relógio do dispositivo.
   * `null` = a sincronizar.
   */
  syncedUtcMs?: number | null;
  /** Fuso IANA para formatar quando `syncedUtcMs` é usado. */
  displayTimeZone?: string;
  /** Locale da data por extenso (ex. pt-BR). */
  dateLocale?: string;
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
  timeVariant = 'default',
  footerTimezone,
  isFullscreen = false,
  syncedUtcMs,
  displayTimeZone,
  dateLocale = 'pt-BR',
}: ClockDisplayProps) {
  const useNetwork =
    typeof displayTimeZone === 'string' && displayTimeZone.length > 0;

  const [deviceTime, setDeviceTime] = useState<Date | null>(null);

  useEffect(() => {
    if (useNetwork) return;
    setDeviceTime(new Date());
    const interval = window.setInterval(() => setDeviceTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, [useNetwork]);

  const networkParts = useMemo(() => {
    if (!useNetwork || syncedUtcMs == null) return null;
    return getWallClockPartsInZone(syncedUtcMs, displayTimeZone!);
  }, [useNetwork, syncedUtcMs, displayTimeZone]);

  const networkDateStr = useMemo(() => {
    if (!useNetwork || syncedUtcMs == null) return '';
    try {
      return new Intl.DateTimeFormat(dateLocale, {
        timeZone: displayTimeZone!,
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(syncedUtcMs));
    } catch {
      return '';
    }
  }, [useNetwork, syncedUtcMs, displayTimeZone, dateLocale]);

  const showLoading =
    (useNetwork && syncedUtcMs === null) || (!useNetwork && !deviceTime);

  if (showLoading) {
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

  let hours: string;
  let minutes: string;
  let seconds: string;
  let dateStr: string;

  if (useNetwork && networkParts) {
    ({ hour: hours, minute: minutes, second: seconds } = networkParts);
    dateStr = networkDateStr;
  } else {
    const time = deviceTime!;
    hours = String(time.getHours()).padStart(2, '0');
    minutes = String(time.getMinutes()).padStart(2, '0');
    seconds = String(time.getSeconds()).padStart(2, '0');
    dateStr = time.toLocaleDateString(dateLocale, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  if (timeVariant === 'homeHero' && showSeconds) {
    return (
      <div
        className={cn(
          'flex select-none flex-col items-center',
          isFullscreen ? 'gap-4 sm:gap-6' : 'gap-3 sm:gap-3.5 md:gap-4',
        )}
      >
        <div
          className="flex items-baseline justify-center gap-0.5"
          role="time"
          suppressHydrationWarning
        >
          <span
            className={cn(
              'clock-digit font-bold tabular-nums leading-none text-[#0052FF]',
              isFullscreen
                ? 'text-7xl leading-[0.95] sm:text-8xl sm:leading-[0.95] md:text-9xl md:leading-[0.95]'
                : 'text-[3.15rem] leading-none min-[400px]:text-6xl min-[400px]:leading-[0.95] sm:text-7xl sm:leading-[0.95] md:text-8xl md:leading-[0.95] lg:text-[5.25rem] xl:text-[5.5rem]',
            )}
          >
            {hours}
            <span
              className={cn('transition-opacity duration-300', isRinging ? 'opacity-100' : 'opacity-60')}
            >
              :
            </span>
            {minutes}
          </span>
          <span
            className={cn(
              'font-bold tabular-nums leading-none text-[#1A1A1A]',
              isFullscreen
                ? 'text-5xl leading-tight sm:text-6xl md:text-7xl md:leading-tight'
                : 'text-[1.85rem] leading-none min-[400px]:text-4xl sm:text-5xl md:leading-tight lg:text-6xl lg:leading-tight',
            )}
          >
            <span
              className={cn('transition-opacity duration-300', isRinging ? 'opacity-100' : 'opacity-60')}
            >
              :
            </span>
            {seconds}
          </span>
        </div>
        {showDate && (
          <p
            className={cn(
              'max-w-[min(100%,28rem)] text-center font-bold capitalize leading-snug text-[#1A1A1A] dark:text-slate-100',
              isFullscreen
                ? 'mt-1 text-lg sm:text-xl sm:leading-8 md:text-2xl'
                : 'mt-0.5 text-base sm:text-lg sm:leading-7',
            )}
            suppressHydrationWarning
          >
            {dateStr}
          </p>
        )}
        {footerTimezone && (
          <p className="mt-0.5 max-w-[min(100%,28rem)] text-center text-sm leading-relaxed text-[#6B7280] sm:text-base dark:text-slate-400">
            {footerTimezone}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex select-none flex-col items-center gap-3">
      <div
        className={cn(
          'clock-digit font-bold tabular-nums leading-none text-[var(--text)] transition-colors duration-300',
          sizeClasses[size]
        )}
        suppressHydrationWarning
      >
        {hours}
        <span
          className={cn('transition-opacity duration-300', isRinging ? 'opacity-100' : 'opacity-55')}
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
