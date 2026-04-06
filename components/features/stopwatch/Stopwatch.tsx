'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Flag, Pause, Play, RotateCcw } from 'lucide-react';
import { formatDuration } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

interface Lap {
  id: number;
  elapsed: number;
  split: number;
}

const LapRow = memo(function LapRow({
  lap,
  isLast,
  isBest,
}: {
  lap: Lap;
  isLast: boolean;
  isBest: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-colors animate-fade-in',
        isLast ? 'border border-border bg-muted/70' : 'bg-muted/35'
      )}
    >
      <span className="w-8 text-muted-foreground">#{lap.id}</span>
      <span
        className={cn(
          'clock-digit font-semibold',
          isBest ? 'text-emerald-400' : 'text-foreground/85'
        )}
      >
        {formatDuration(lap.split, true)}
      </span>
      <span className="clock-digit text-muted-foreground">{formatDuration(lap.elapsed, true)}</span>
    </div>
  );
});

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      const tick = () => {
        setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current!));
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
    }
    setRunning(r => !r);
  }, [running, elapsed]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    if (!running) return;
    setLaps(prev => {
      const lastLapElapsed = prev[prev.length - 1]?.elapsed ?? 0;
      return [...prev, { id: prev.length + 1, elapsed, split: elapsed - lastLapElapsed }];
    });
  }, [running, elapsed]);

  const display = formatDuration(elapsed, true);
  const [mainPart, msPart] = display.split('.');

  const bestLap = laps.length ? laps.reduce((min, l) => (l.split < min.split ? l : min), laps[0]) : null;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="relative flex flex-col items-center">
        <div className="clock-digit text-6xl font-bold tabular-nums leading-none text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          {mainPart}
          <span className="text-2xl text-muted-foreground sm:text-4xl md:text-5xl">.{msPart ?? '00'}</span>
        </div>
        {running && (
          <div className="absolute -bottom-6 flex gap-1" aria-hidden>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-1 w-1 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.96]"
          aria-label="Resetar"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={toggle}
          className={cn(
            'flex h-[4.25rem] w-[4.25rem] min-h-[68px] min-w-[68px] items-center justify-center rounded-full text-primary-foreground shadow-xl transition-transform active:scale-[0.96]',
            running
              ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600'
              : 'bg-primary shadow-primary/30 hover:bg-primary/90'
          )}
          aria-label={running ? 'Pausar' : 'Iniciar'}
        >
          {running ? <Pause className="h-8 w-8" /> : <Play className="ml-0.5 h-8 w-8" />}
        </button>

        <button
          type="button"
          onClick={addLap}
          disabled={!running}
          className="flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 active:scale-[0.96]"
          aria-label="Marcar volta"
        >
          <Flag className="h-5 w-5" />
        </button>
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-lg space-y-1">
          <div className="flex justify-between px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>#</span>
            <span>Parcial</span>
            <span>Total</span>
          </div>
          <div className="max-h-[min(16rem,50vh)] space-y-1 overflow-y-auto overscroll-contain pr-1">
            {[...laps].reverse().map((lap, idx) => (
              <LapRow
                key={lap.id}
                lap={lap}
                isLast={idx === 0}
                isBest={bestLap?.id === lap.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
