'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { AlarmRingingBanner } from '@/components/ui/AlarmRingingBanner';
import { formatDuration, playAlarmSound } from '@/lib/time-utils';
import { TIMER_PRESETS } from '@/lib/constants/timer-presets';
import { cn } from '@/lib/utils';

export default function Timer() {
  const [totalMs, setTotalMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [inputH, setInputH] = useState('0');
  const [inputM, setInputM] = useState('0');
  const [inputS, setInputS] = useState('0');

  const intervalRef = useRef<number | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimerInterval();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemainingMs(prev => {
        if (prev === 0) {
          clearTimerInterval();
          setIsRunning(false);
          return 0;
        }
        if (prev > 0 && prev <= 1000) {
          clearTimerInterval();
          setIsRunning(false);
          setIsRinging(true);
          if (stopSoundRef.current) {
            stopSoundRef.current();
            stopSoundRef.current = null;
          }
          stopSoundRef.current = playAlarmSound(0.6);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      clearTimerInterval();
    };
  }, [isRunning, clearTimerInterval]);

  function buildFromInput() {
    return (
      (parseInt(inputH || '0', 10) * 3600 +
        parseInt(inputM || '0', 10) * 60 +
        parseInt(inputS || '0', 10)) *
      1000
    );
  }

  const stopRinging = useCallback(() => {
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    setIsRinging(false);
  }, []);

  const startTimer = useCallback(() => {
    stopRinging();
    clearTimerInterval();

    if (remainingMs === 0) {
      const total = buildFromInput();
      if (total === 0) return;
      setTotalMs(total);
      setRemainingMs(total);
      setIsRunning(true);
      return;
    }

    setIsRunning(true);
  }, [remainingMs, stopRinging, clearTimerInterval, inputH, inputM, inputS]);

  const pauseTimer = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
  }, [clearTimerInterval]);

  const resetTimer = useCallback(() => {
    stopRinging();
    clearTimerInterval();
    setIsRunning(false);
    setRemainingMs(0);
    setTotalMs(0);
  }, [stopRinging, clearTimerInterval]);

  const editTimer = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setRemainingMs(0);
    setTotalMs(0);
  }, [clearTimerInterval]);

  function applyPreset(seconds: number) {
    stopRinging();
    clearTimerInterval();
    setIsRunning(false);
    const ms = seconds * 1000;
    setTotalMs(ms);
    setRemainingMs(ms);
  }

  const showDial = remainingMs > 0 || isRunning || isRinging;
  const progress = totalMs > 0 ? ((totalMs - remainingMs) / totalMs) * 100 : 0;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {showDial ? (
        <div className="relative mx-auto flex aspect-square w-[min(100%,clamp(240px,30vw,320px))] shrink-0 items-center justify-center">
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 260 260"
            aria-hidden
          >
            <circle
              cx="130"
              cy="130"
              r="110"
              fill="none"
              stroke="var(--border)"
              strokeOpacity={0.55}
              strokeWidth="6"
            />
            <circle
              cx="130"
              cy="130"
              r="110"
              fill="none"
              stroke={isRinging ? 'var(--danger)' : 'var(--primary)'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 130 130)"
              className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
            />
          </svg>
          <div
            className={cn(
              'clock-digit pointer-events-none relative z-[2] flex items-center justify-center text-5xl font-bold tabular-nums sm:text-6xl md:text-7xl',
              isRinging ? 'animate-pulse text-destructive' : 'text-foreground'
            )}
          >
            {formatDuration(remainingMs)}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {(['h', 'm', 's'] as const).map((unit, i) => {
              const labels = ['Horas', 'Minutos', 'Segundos'];
              const values = [inputH, inputM, inputS];
              const setters = [setInputH, setInputM, setInputS];
              const maxVals = [99, 59, 59];
              return (
                <div key={unit} className="flex flex-col items-center gap-1.5">
                  <label className="text-xs text-muted-foreground">{labels[i]}</label>
                  <input
                    type="number"
                    min={0}
                    max={maxVals[i]}
                    value={values[i]}
                    onChange={e => setters[i](e.target.value)}
                    className="min-h-[52px] w-full rounded-xl border border-border bg-card px-2 py-3 text-center text-xl font-bold text-foreground focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20 [appearance:textfield] sm:text-2xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIMER_PRESETS.map(({ label, seconds }) => (
              <button
                key={seconds}
                type="button"
                onClick={() => applyPreset(seconds)}
                className="min-h-[44px] rounded-xl border border-border bg-muted/50 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-foreground active:scale-[0.98]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <AlarmRingingBanner isRinging={isRinging} onStop={stopRinging} />

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={resetTimer}
          className="relative z-10 flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.96]"
          aria-label="Resetar"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={isRinging}
          className={cn(
            'relative z-10 flex h-[4.25rem] w-[4.25rem] min-h-[68px] min-w-[68px] items-center justify-center rounded-full text-primary-foreground shadow-xl transition-transform active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40',
            isRunning
              ? 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600'
              : 'bg-primary shadow-primary/30 hover:bg-primary/90'
          )}
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause className="h-8 w-8" /> : <Play className="ml-0.5 h-8 w-8" />}
        </button>

        {remainingMs > 0 && !isRunning && !isRinging && (
          <button
            type="button"
            onClick={editTimer}
            className="relative z-10 flex min-h-[44px] min-w-[4.5rem] items-center justify-center rounded-full border border-border bg-muted/50 px-3 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.96]"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}
