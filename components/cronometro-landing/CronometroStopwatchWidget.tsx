'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/time-utils';
import { Flag, Maximize2, Minimize2, Pause, Play, RefreshCcw, Timer } from 'lucide-react';

function digits(ms: number): { h: string; m: string; s: string; cs: string } {
  const t = Math.floor(ms);
  const totalSeconds = Math.floor(t / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const centis = Math.floor((t % 1000) / 10);
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(s).padStart(2, '0'),
    cs: String(centis).padStart(2, '0'),
  };
}

/** HH:MM:SS.cs — centésimos (floor(ms%1000)/10), 2 dígitos; colagem Excel (tab). */
function formatCumulativeHmsCs(ms: number): string {
  const t = Math.floor(ms);
  const totalSeconds = Math.floor(t / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const centis = Math.floor((t % 1000) / 10);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}

/**
 * Widget de cronômetro com UI dedicada (layout novo da página /cronometro).
 */
export function CronometroStopwatchWidget() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  /** True after the user has started counting at least once; cleared on Zerar. */
  const [sessionActive, setSessionActive] = useState(false);
  const [laps, setLaps] = useState<{ id: number; split: number; cumulative: number }[]>([]);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const copyHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      const tick = () => {
        setElapsed(accumulatedRef.current + (Date.now() - (startTimeRef.current ?? 0)));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const toggle = useCallback(() => {
    if (running) {
      accumulatedRef.current = elapsed;
      setRunning(false);
    } else {
      setSessionActive(true);
      setRunning(true);
    }
  }, [running, elapsed]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setSessionActive(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
    if (copyHideTimerRef.current) {
      clearTimeout(copyHideTimerRef.current);
      copyHideTimerRef.current = null;
    }
    setCopied(false);
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    if (!running) return;
    setLaps(prev => {
      const prevCumulative = prev.length > 0 ? prev[prev.length - 1]!.cumulative : 0;
      return [
        ...prev,
        { id: prev.length + 1, split: elapsed - prevCumulative, cumulative: elapsed },
      ];
    });
  }, [running, elapsed]);

  const lastLapRowRef = useRef<HTMLLIElement | null>(null);

  const copyLaps = useCallback(() => {
    if (laps.length === 0) return;
    const text = laps
      .map((lap, index) => `Volta ${index + 1}\t${formatCumulativeHmsCs(lap.cumulative)}`)
      .join('\n');
    void navigator.clipboard.writeText(text).then(
      () => {
        if (copyHideTimerRef.current) clearTimeout(copyHideTimerRef.current);
        setCopied(true);
        copyHideTimerRef.current = setTimeout(() => {
          setCopied(false);
          copyHideTimerRef.current = null;
        }, 2000);
      },
      () => {
        setCopied(false);
      },
    );
  }, [laps]);

  useEffect(
    () => () => {
      if (copyHideTimerRef.current) clearTimeout(copyHideTimerRef.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (laps.length === 0) return;
    lastLapRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [laps]);

  const d = digits(elapsed);
  const lastLap = laps.length > 0 ? laps[laps.length - 1] : null;
  const paused = !running && sessionActive;
  const idle = !running && !sessionActive;
  const containerSurface = running
    ? 'border-emerald-200/90 bg-emerald-50/35'
    : paused
      ? 'border-amber-200/95 bg-amber-50/40'
      : 'border-gray-200 bg-white';
  const primaryBtnClass = paused
    ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600 hover:shadow-amber-500/30'
    : running
      ? 'bg-emerald-600 text-white shadow-emerald-600/25 hover:bg-emerald-700 hover:shadow-emerald-600/35'
      : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30';

  const splitHighlights = useMemo(() => {
    if (laps.length < 2) return { bestId: null as number | null, worstId: null as number | null };
    const splits = laps.map(l => l.split);
    const min = Math.min(...splits);
    const max = Math.max(...splits);
    if (min === max) return { bestId: null, worstId: null };
    return {
      bestId: laps.find(l => l.split === min)?.id ?? null,
      worstId: laps.find(l => l.split === max)?.id ?? null,
    };
  }, [laps]);

  const hundredMsBucket = Math.floor(elapsed / 100);
  const csBucketRef = useRef(hundredMsBucket);
  const [csOpacityMul, setCsOpacityMul] = useState(1);
  useEffect(() => {
    if (csBucketRef.current === hundredMsBucket) return;
    csBucketRef.current = hundredMsBucket;
    setCsOpacityMul(0.88);
    const tid = window.setTimeout(() => setCsOpacityMul(1), 110);
    return () => window.clearTimeout(tid);
  }, [hundredMsBucket]);

  const sep = (char: string) => (
    <span
      className={cn(
        'clock-digit select-none font-bold tabular-nums leading-none tracking-tight text-gray-900',
        isFullscreen ? 'text-6xl sm:text-7xl lg:text-8xl' : 'text-4xl sm:text-5xl lg:text-6xl',
      )}
      aria-hidden
    >
      {char}
    </span>
  );

  const timeBlock = (val: string, label: string) => (
    <div className="flex min-w-0 flex-col items-center sm:min-w-[2.75rem]">
      <span
        className={cn(
          'clock-digit text-center font-bold tabular-nums leading-none tracking-tight text-gray-900',
          isFullscreen ? 'text-7xl sm:text-8xl' : 'text-4xl sm:text-5xl lg:text-6xl',
        )}
      >
        {val}
      </span>
      {!isFullscreen && (
        <span className="mt-1.5 min-h-[1rem] text-center font-sans text-xs font-normal leading-tight text-gray-500">
          {label}
        </span>
      )}
    </div>
  );

  const timeBlockCs = (val: string, label: string) => (
    <div className="flex min-w-0 flex-col items-center sm:min-w-[2.35rem]">
      <span
        className={cn(
          'clock-digit text-center font-bold tabular-nums leading-none tracking-tight text-gray-900',
          isFullscreen ? 'text-7xl sm:text-8xl' : 'text-4xl sm:text-5xl lg:text-6xl',
        )}
      >
        <span
          className="inline-block text-[0.85em] align-baseline transition-[opacity] duration-150 ease-out will-change-[opacity]"
          style={{ opacity: 0.6 * csOpacityMul }}
        >
          {val}
        </span>
      </span>
      {!isFullscreen && (
        <span className="mt-1.5 min-h-[1rem] text-center font-sans text-xs font-normal leading-tight text-gray-500">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div className={cn('relative mx-auto w-full max-w-[520px]', !isFullscreen && 'pt-5')}>
      {!isFullscreen && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100/80 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-[#2563EB] shadow-sm">
            <Timer className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
            Cronômetro
          </span>
        </div>
      )}

      <div
        ref={cardRef}
        id="cronometro-widget"
        className={cn(
          'relative flex w-full min-w-0 max-w-full flex-col overflow-hidden',
          isFullscreen
            ? 'min-h-[100dvh] h-[100dvh] items-center justify-center overflow-y-auto border-0 bg-gray-50 px-6 py-6 shadow-none sm:px-10 sm:py-8'
            : cn(
                'h-[380px] rounded-2xl border px-6 pb-6 pt-10 shadow-md transition-[background-color,border-color] duration-300 ease-out',
                containerSurface,
              ),
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute left-6 top-6 z-20 h-2 w-2 rounded-full transition-[background-color,box-shadow] duration-200 ease-out',
            running &&
              'bg-emerald-500 shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_0_14px_rgba(16,185,129,0.45)]',
            paused &&
              'bg-amber-400 shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_0_12px_rgba(251,191,36,0.42)]',
            idle && 'bg-gray-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]',
          )}
          title={
            running ? 'Rodando' : paused ? 'Pausado' : 'Parado'
          }
          aria-hidden
        />
        <div className="absolute right-6 top-6 z-20">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-lg p-1.5 text-gray-500 transition-[transform,box-shadow,color,background-color] duration-100 ease-out hover:bg-gray-200/80 hover:text-blue-600 active:scale-[0.97] active:shadow-inner"
            aria-label={isFullscreen ? 'Sair do modo foco (tela cheia)' : 'Modo foco — tela cheia do cronômetro'}
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
              ? 'w-full max-w-2xl flex-none flex-col items-center gap-6 text-center sm:gap-8'
              : 'min-h-0 flex-1',
          )}
        >
          <div
            className={cn(
              'flex-shrink-0',
              isFullscreen ? 'w-full text-center' : 'mt-6',
            )}
          >
            <div className="flex w-full min-w-0 flex-wrap items-baseline justify-center gap-0.5 tracking-tight sm:gap-1">
              {timeBlock(d.h, 'Horas')}
              {sep(':')}
              {timeBlock(d.m, 'Minutos')}
              {sep(':')}
              {timeBlock(d.s, 'Segundos')}
              {sep('.')}
              {timeBlockCs(d.cs, 'Milissegundos')}
            </div>
          </div>

          <div
            className={cn(
              'flex shrink-0 flex-wrap items-center justify-center gap-3 sm:gap-4',
              isFullscreen ? 'mt-0 justify-center gap-3' : 'mt-4',
            )}
          >
            <button
              type="button"
              onClick={toggle}
              className={cn(
                'inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-[transform,box-shadow,background-color,color] duration-100 ease-out active:scale-[0.97] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] sm:px-6 sm:py-3',
                primaryBtnClass,
              )}
            >
              {running ? (
                <Pause className="h-4 w-4 shrink-0 text-white" fill="currentColor" strokeWidth={0} aria-hidden />
              ) : (
                <Play className="h-4 w-4 shrink-0 fill-current text-white" strokeWidth={0} aria-hidden />
              )}
              {running ? 'Pausar' : paused ? 'Continuar' : 'Iniciar'}
            </button>
            <button
              type="button"
              onClick={addLap}
              disabled={!running}
              className="inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-[transform,box-shadow,background-color,color] duration-100 ease-out hover:bg-gray-50 hover:shadow-md active:scale-[0.97] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-sm sm:px-6 sm:py-3"
            >
              <Flag className="h-4 w-4 shrink-0 text-gray-500" />
              Volta
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-[transform,box-shadow,background-color,color] duration-100 ease-out hover:bg-gray-50 hover:shadow-md active:scale-[0.97] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.08)] sm:px-6 sm:py-3"
            >
              <RefreshCcw className="h-4 w-4 shrink-0 text-gray-500" />
              Zerar
            </button>
          </div>

        {!isFullscreen && paused && (
          <p className="mt-3 shrink-0 text-center text-xs font-medium text-amber-900/80">Cronômetro pausado</p>
        )}

        <div
          className={cn(
            'flex w-full flex-col overflow-hidden transition-all duration-200 ease-out',
            isFullscreen
              ? cn(
                  'mt-6 w-full max-w-md min-h-0 flex-none self-center',
                  laps.length > 0 && 'max-h-[min(42dvh,22rem)]',
                )
              : 'mt-4 min-h-0 flex-1',
          )}
        >
          {laps.length === 0 ? (
            <div
              className={cn(
                'flex flex-col items-center justify-center text-center transition-opacity duration-200 ease-out',
                isFullscreen ? 'min-h-0 py-2' : 'mt-6 flex min-h-0 flex-1',
              )}
            >
              {!isFullscreen && (
                <div
                  className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
                  aria-hidden
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </div>
              )}
              <p className={cn('font-semibold text-gray-900', isFullscreen ? 'text-lg' : 'text-base')}>
                Nenhuma volta registrada
              </p>
              {!isFullscreen && (
                <p className="mx-auto mt-2 max-w-[420px] text-center text-sm leading-[1.6] text-gray-500">
                  Use o cronômetro para medir treinos, estudos ou tarefas e registre voltas para acompanhar seu desempenho.
                </p>
              )}
            </div>
          ) : (
            <div
              className={cn(
                'flex min-h-0 flex-col pt-3',
                isFullscreen ? 'h-full min-h-0 flex-1 border-t border-gray-200/60' : 'min-h-0 flex-1 border-t border-gray-100',
              )}
              aria-label="Voltas registadas"
            >
              <div
                className="min-h-0 flex-1 overflow-y-auto pr-1 scroll-smooth [scrollbar-gutter:stable] [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.55)_transparent] [-webkit-overflow-scrolling:touch]"
                role="list"
                aria-live="polite"
                aria-relevant="additions"
              >
                <ul className="w-full min-w-0">
                  {laps.map((lap, index) => {
                    const isLatest = index === laps.length - 1;
                    const isBest = splitHighlights.bestId === lap.id;
                    const isWorst = splitHighlights.worstId === lap.id && !isBest;
                    return (
                      <li
                        key={lap.id}
                        ref={isLatest ? lastLapRowRef : undefined}
                        role="listitem"
                        aria-current={isLatest ? 'true' : undefined}
                        className={cn(
                          'flex items-baseline justify-between gap-3 border-l-[3px] py-2 text-sm transition-[border-color,box-shadow] duration-150 ease-out',
                          !isBest && !isWorst && 'border-l-transparent',
                          isBest && 'border-l-emerald-500',
                          isWorst && 'border-l-red-500',
                          !isLatest && 'border-b border-gray-100/90',
                          isLatest &&
                            '-mx-0.5 mt-0.5 rounded-md border-l-[3px] border-b-0 border-r-0 border-t-0 border-transparent bg-gradient-to-b from-blue-50/95 to-blue-50/60 px-2 py-2.5 shadow-sm ring-1 ring-blue-200/50 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.5)] first:mt-0',
                          isLatest && isBest && 'border-l-emerald-500 ring-emerald-200/40',
                          isLatest && isWorst && 'border-l-red-500 ring-red-200/40',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex min-w-0 items-baseline gap-1.5',
                            isLatest && 'text-gray-800',
                          )}
                        >
                          <span className="text-gray-500">Volta</span>
                          <span
                            className={cn(
                              'min-w-[1.25rem] text-sm font-semibold tabular-nums text-gray-900',
                              isLatest && 'text-blue-800',
                            )}
                          >
                            {lap.id}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'clock-digit min-w-0 truncate text-right tabular-nums tracking-tight transition-[color] duration-150',
                            isLatest && !isBest && !isWorst && 'font-medium text-gray-900',
                            !isLatest && !isBest && !isWorst && 'text-gray-700',
                            isBest && 'font-semibold tabular-nums text-emerald-700',
                            isWorst && 'font-medium text-red-600/95',
                          )}
                        >
                          {formatDuration(lap.cumulative, true)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {copied && (
                <p className="mb-0.5 shrink-0 text-right text-xs text-gray-500">Copiado!</p>
              )}
              <button
                type="button"
                onClick={copyLaps}
                className={cn(
                  'mt-2 shrink-0 text-sm text-blue-600 underline-offset-2 hover:underline',
                  isFullscreen ? 'mx-auto block w-full max-w-xs text-center' : 'text-right',
                )}
              >
                Copiar voltas
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {lastLap && (
        <p className="sr-only" aria-atomic>
          Última parcial: {formatDuration(lastLap.split, true)}. Total: {formatDuration(lastLap.cumulative, true)}.
        </p>
      )}
    </div>
  );
}
