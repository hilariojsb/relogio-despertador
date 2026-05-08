'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Laptop, Maximize2, Minimize2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import ClockDisplay from '@/components/features/clock/ClockDisplay';
import { useSyncedUtcClock } from '@/hooks/useSyncedUtcClock';

const TZ_CITY: Record<string, string> = {
  'America/Sao_Paulo': 'São Paulo, Brasil',
  'America/Manaus': 'Manaus, Brasil',
  'America/Fortaleza': 'Fortaleza, Brasil',
  'America/Belem': 'Belém, Brasil',
  'America/Cuiaba': 'Cuiabá, Brasil',
  'America/Campo_Grande': 'Campo Grande, Brasil',
  'America/Recife': 'Recife, Brasil',
  'America/Bahia': 'Salvador, Brasil',
  'America/Rio_Branco': 'Rio Branco, Brasil',
  'America/Noronha': 'Fernando de Noronha, Brasil',
  'America/Santiago': 'Santiago, Chile',
  'America/Buenos_Aires': 'Buenos Aires, Argentina',
  'Europe/Lisbon': 'Lisboa, Portugal',
  'America/New_York': 'Nova York, EUA',
  'America/Los_Angeles': 'Los Angeles, EUA',
  'Europe/London': 'Londres, Reino Unido',
};

function formatGmtForZone(timeZone: string, refUtcMs: number): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(new Date(refUtcMs));
    return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function describeTimeZone(tz: string, refUtcMs: number) {
  const city = TZ_CITY[tz] ?? tz.replace(/_/g, ' ');
  const longName =
    new Intl.DateTimeFormat('pt-BR', { timeZone: tz, timeZoneName: 'long' })
      .formatToParts(new Date(refUtcMs))
      .find(p => p.type === 'timeZoneName')?.value ?? '';
  const gmt = formatGmtForZone(tz, refUtcMs);
  const zoneLine = [longName, gmt && `(${gmt})`].filter(Boolean).join(' ');
  return { city, zoneLine };
}

export default function HomeHeroClockCard() {
  const { utcNowMs, geo, worldTimeTz } = useSyncedUtcClock();
  const deviceTz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC';
  const displayTz = geo?.timezone ?? worldTimeTz ?? deviceTz;

  const [{ city, zoneLine }, setLoc] = useState({
    city: 'A carregar localização…',
    zoneLine: '',
  });
  const [online, setOnline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const refUtc = utcNowMs ?? Date.now();
    if (geo?.city && geo.country) {
      const { zoneLine: z } = describeTimeZone(displayTz, refUtc);
      setLoc({ city: `${geo.city}, ${geo.country}`, zoneLine: z });
    } else {
      setLoc(describeTimeZone(displayTz, refUtc));
    }
  }, [displayTz, geo?.city, geo?.country, utcNowMs != null]);

  useEffect(() => {
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    function handleFullscreenChange() {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const fs = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        setIsFullscreen(false);
        return;
      }
      setIsFullscreen(fs === cardRef.current);
    }
    handleFullscreenChange();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        const req =
          el.requestFullscreen?.bind(el) ??
          (el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.bind(el);
        void req?.();
      } else {
        const doc = document as Document & { webkitExitFullscreen?: () => void };
        if (document.exitFullscreen) void document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      id="hora-certa"
      className={cn(
        'relative flex w-full min-w-0 max-w-full flex-col overflow-hidden',
        isFullscreen
          ? 'h-[100dvh] min-h-[100dvh] items-center justify-center overflow-y-auto border-0 bg-[#F8FAFC] dark:bg-slate-900'
          : cn(
              'scroll-mt-28 rounded-3xl border border-slate-200/80 bg-white',
              'shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12),0_8px_24px_-6px_rgba(15,23,42,0.08)]',
              'dark:border-slate-600/50 dark:bg-slate-800/90 dark:shadow-slate-950/30',
            ),
      )}
    >
      <div className="absolute right-6 top-6 z-20">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-[#0052FF] dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-sky-300"
          aria-label={isFullscreen ? 'Sair do modo foco (tela cheia)' : 'Modo foco — tela cheia do relógio'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          ) : (
            <Maximize2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>

      <div
        className={cn(
          'flex w-full flex-col',
          isFullscreen
            ? 'mx-auto max-w-2xl flex-none items-center justify-center gap-6 px-6 pb-8 pt-14 text-center'
            : '',
        )}
      >
        <div
          className={cn(
            isFullscreen
              ? 'w-full'
              : 'px-6 pb-1 pt-8 min-[400px]:px-8 min-[400px]:pt-9 sm:px-8 sm:pb-2 sm:pt-10 md:px-8 md:pt-10 lg:px-8 lg:pt-10',
          )}
        >
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-base font-medium text-[#1A1A1A] sm:text-[1.05rem] md:text-lg dark:text-slate-100">
            <span>Hora atual em</span>
            <span className="inline-flex max-w-full items-center gap-0 font-semibold text-[#0052FF]">
              <span className="min-w-0 break-words">{city}</span>
              {geo?.countryCode ? (
                <img
                  src={`https://flagcdn.com/w40/${geo.countryCode.toLowerCase()}.png`}
                  alt={
                    geo.country
                      ? `Bandeira de ${geo.country}`
                      : `Bandeira (${geo.countryCode})`
                  }
                  loading="lazy"
                  width={28}
                  height={18}
                  className="ml-1.5 h-[18px] w-auto max-h-5 min-h-4 shrink-0 rounded-[3px] object-cover"
                />
              ) : null}
            </span>
          </p>
          <div
            className={cn(
              'flex justify-center',
              isFullscreen ? 'mt-4' : 'mt-6 sm:mt-7 md:mt-8',
            )}
            role="img"
            aria-label="Hora local atual"
          >
            <ClockDisplay
              size="xl"
              showSeconds
              showDate
              timeVariant="homeHero"
              isFullscreen={isFullscreen}
              footerTimezone={isFullscreen ? undefined : zoneLine || undefined}
              syncedUtcMs={utcNowMs}
              displayTimeZone={displayTz}
            />
          </div>
        </div>

        {!isFullscreen && (
          <div
            className="mx-2 mb-3 mt-2 rounded-2xl bg-[#F8F9FA] py-4 pl-3 pr-2 min-[400px]:mx-3 min-[400px]:mb-4 min-[400px]:py-4 min-[400px]:pl-3 min-[400px]:pr-2 sm:mx-4 sm:py-5 sm:pl-4 sm:pr-3 dark:bg-slate-800/70"
            aria-label="Indicadores"
          >
            <ul className="grid w-full grid-cols-1 gap-4 min-[400px]:-translate-x-0.5 min-[400px]:grid-cols-3 min-[400px]:gap-0 min-[400px]:divide-x min-[400px]:divide-slate-200/70 dark:min-[400px]:divide-slate-600/50">
              <li className="flex min-w-0 flex-col items-stretch gap-2 px-0 pb-4 min-[400px]:px-2 min-[400px]:pb-0 sm:min-[400px]:px-2.5">
                <div className="flex w-full min-w-0 items-start gap-2.5 sm:gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-600/40">
                    <Target className="h-5 w-5 text-[#0052FF]" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-medium text-[#6B7280] dark:text-slate-400">Precisão</span>
                    <span className="mt-0.5 block text-base font-bold tabular-nums text-[#1A1A1A] dark:text-slate-100">
                      100%
                    </span>
                  </div>
                </div>
                <p className="w-full min-w-0 text-left text-xs leading-snug text-[#6B7280] dark:text-slate-400">
                  Sincronizado com
                  <br />
                  servidores oficiais
                </p>
              </li>
              <li className="flex min-w-0 flex-col items-stretch gap-2 px-0 pb-4 min-[400px]:px-2 min-[400px]:pb-0 sm:min-[400px]:px-2.5">
                <div className="flex w-full min-w-0 items-start gap-2.5 sm:gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-600/40">
                    {online ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-medium text-[#6B7280] dark:text-slate-400">Status</span>
                    <span className="mt-0.5 block text-base font-bold text-[#1A1A1A] dark:text-slate-100">
                      {online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <p className="w-full min-w-0 text-left text-xs leading-snug text-[#6B7280] dark:text-slate-400">
                  {online ? (
                    <>
                      Conectado e
                      <br />
                      atualizado
                    </>
                  ) : (
                    <>
                      Sem ligação à
                      <br />
                      rede
                    </>
                  )}
                </p>
              </li>
              <li className="flex min-w-0 flex-col items-stretch gap-2 px-0 pb-0 min-[400px]:px-2 sm:min-[400px]:px-2.5">
                <div className="flex w-full min-w-0 items-start gap-2.5 sm:gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-600/40">
                    <Laptop className="h-5 w-5 text-slate-500 dark:text-slate-400" strokeWidth={2} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="block text-xs font-medium text-[#6B7280] dark:text-slate-400">Consumo</span>
                    <span className="mt-0.5 block text-base font-bold text-[#1A1A1A] dark:text-slate-100">Baixo</span>
                  </div>
                </div>
                <p className="w-full min-w-0 text-left text-xs leading-snug text-[#6B7280] dark:text-slate-400">
                  Leve e otimizado para
                  <br />
                  qualquer dispositivo
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
