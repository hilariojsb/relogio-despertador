'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Brain, Coffee, Pause, Play, RotateCcw } from 'lucide-react';
import { AlarmRingingBanner } from '@/components/ui/AlarmRingingBanner';
import { playAlarmSound } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

type Phase = 'focus' | 'break' | 'longBreak';

interface Settings {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  longBreakAfter: number;
}

const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  longBreakAfter: 4,
};

const PHASE_LABELS: Record<Phase, string> = {
  focus: 'Foco',
  break: 'Pausa curta',
  longBreak: 'Pausa longa',
};

const PHASE_TEXT: Record<Phase, string> = {
  focus: 'text-primary',
  break: 'text-emerald-400',
  longBreak: 'text-amber-400',
};

const PHASE_STROKE: Record<Phase, string> = {
  focus: 'var(--primary)',
  break: '#22c55e',
  longBreak: '#f59e0b',
};

const PHASE_BTN: Record<Phase, string> = {
  focus: 'bg-primary shadow-primary/30 hover:bg-primary/90',
  break: 'bg-emerald-500 shadow-emerald-500/25 hover:bg-emerald-600',
  longBreak: 'bg-amber-500 shadow-amber-500/25 hover:bg-amber-600',
};

export default function PomodoroTimer() {
  const [settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<Phase>('focus');
  const [remaining, setRemaining] = useState(DEFAULT_SETTINGS.focusMinutes * 60 * 1000);
  const [totalForPhase, setTotalForPhase] = useState(DEFAULT_SETTINGS.focusMinutes * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const stopSoundRef = useRef<(() => void) | null>(null);
  const phaseRef = useRef(phase);
  const completedRef = useRef(completedPomodoros);
  const endedPhaseRef = useRef<Phase | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    completedRef.current = completedPomodoros;
  }, [completedPomodoros]);

  const applyPhaseTransitionFrom = useCallback(
    (ended: Phase) => {
      if (ended === 'focus') {
        const nextCount = completedRef.current + 1;
        setCompletedPomodoros(nextCount);
        const nextPhase: Phase = nextCount % settings.longBreakAfter === 0 ? 'longBreak' : 'break';
        const nextMs =
          nextPhase === 'longBreak'
            ? settings.longBreakMinutes * 60 * 1000
            : settings.breakMinutes * 60 * 1000;
        setPhase(nextPhase);
        setRemaining(nextMs);
        setTotalForPhase(nextMs);
      } else {
        const nextMs = settings.focusMinutes * 60 * 1000;
        setPhase('focus');
        setRemaining(nextMs);
        setTotalForPhase(nextMs);
      }
    },
    [settings]
  );

  const dismissRinging = useCallback(() => {
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    setIsRinging(false);
    const ended = endedPhaseRef.current;
    endedPhaseRef.current = null;
    if (ended) applyPhaseTransitionFrom(ended);
  }, [applyPhaseTransitionFrom]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining(r => {
        if (r <= 1000) {
          setRunning(false);
          endedPhaseRef.current = phaseRef.current;
          setIsRinging(true);
          if (stopSoundRef.current) {
            stopSoundRef.current();
            stopSoundRef.current = null;
          }
          stopSoundRef.current = playAlarmSound(0.5);
          return 0;
        }
        return r - 1000;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const toggleRunning = useCallback(() => {
    if (isRinging) return;
    setRunning(r => !r);
  }, [isRinging]);

  const reset = useCallback(() => {
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    setRunning(false);
    setIsRinging(false);
    endedPhaseRef.current = null;
    setPhase('focus');
    const ms = settings.focusMinutes * 60 * 1000;
    setRemaining(ms);
    setTotalForPhase(ms);
    setCompletedPomodoros(0);
  }, [settings.focusMinutes]);

  const skipPhase = useCallback(() => {
    setRunning(false);
    if (isRinging) {
      dismissRinging();
      return;
    }
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    applyPhaseTransitionFrom(phaseRef.current);
  }, [isRinging, dismissRinging, applyPhaseTransitionFrom]);

  const setPhaseManual = useCallback(
    (p: Phase) => {
      if (stopSoundRef.current) {
        stopSoundRef.current();
        stopSoundRef.current = null;
      }
      setRunning(false);
      setIsRinging(false);
      endedPhaseRef.current = null;
      setPhase(p);
      const ms =
        p === 'focus'
          ? settings.focusMinutes * 60 * 1000
          : p === 'break'
            ? settings.breakMinutes * 60 * 1000
            : settings.longBreakMinutes * 60 * 1000;
      setRemaining(ms);
      setTotalForPhase(ms);
    },
    [settings]
  );

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const progress = totalForPhase > 0 ? ((totalForPhase - remaining) / totalForPhase) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const strokeColor = isRinging ? 'var(--danger)' : PHASE_STROKE[phase];
  const labelColor = isRinging ? 'text-destructive' : PHASE_TEXT[phase];

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex w-full max-w-md flex-wrap justify-center gap-2 sm:flex-nowrap sm:gap-3">
        {(['focus', 'break', 'longBreak'] as Phase[]).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPhaseManual(p)}
            disabled={isRinging}
            className={cn(
              'min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all sm:max-w-[10rem] disabled:opacity-40',
              phase === p
                ? cn('border border-border bg-muted/80', PHASE_TEXT[p])
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {PHASE_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="relative mx-auto flex aspect-square w-[min(100%,clamp(270px,34vw,360px))] shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 280 280"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        >
          <circle cx="140" cy="140" r="120" fill="none" stroke="var(--border)" strokeOpacity={0.45} strokeWidth="8" />
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 140 140)"
            className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-1">
          <div className={cn('text-[11px] font-semibold uppercase tracking-[0.2em]', labelColor)}>
            {PHASE_LABELS[phase]}
          </div>
          <div
            className={cn(
              'relative z-[2] clock-digit text-6xl font-bold tabular-nums sm:text-7xl md:text-8xl',
              isRinging ? 'animate-pulse text-destructive' : labelColor
            )}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="mt-1 flex gap-1.5">
            {Array.from({ length: settings.longBreakAfter }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors',
                  i < (completedPomodoros % settings.longBreakAfter) ? 'bg-primary' : 'bg-white/10'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {completedPomodoros > 0 ? (
            <>
              <span className="font-semibold text-foreground">{completedPomodoros}</span> pomodoro
              {completedPomodoros !== 1 ? 's' : ''} completo{completedPomodoros !== 1 ? 's' : ''}
            </>
          ) : (
            'Pronto para focar?'
          )}
        </p>
      </div>

      <AlarmRingingBanner isRinging={isRinging} onStop={dismissRinging} />

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
          onClick={toggleRunning}
          disabled={isRinging}
          className={cn(
            'flex h-[4.25rem] w-[4.25rem] min-h-[68px] min-w-[68px] items-center justify-center rounded-full text-primary-foreground shadow-xl transition-transform active:scale-[0.96] disabled:opacity-40',
            PHASE_BTN[phase]
          )}
          aria-label={running ? 'Pausar' : 'Iniciar'}
        >
          {running ? <Pause className="h-8 w-8" /> : <Play className="ml-0.5 h-8 w-8" />}
        </button>

        <button
          type="button"
          onClick={skipPhase}
          className="flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-[0.96]"
          aria-label="Pular fase"
        >
          {phase === 'focus' ? <Coffee className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
        </button>
      </div>

      <div className="glass-panel grid w-full max-w-lg grid-cols-3 gap-3 p-4 text-center sm:gap-4 sm:p-5">
        {[
          { label: 'Foco', value: `${settings.focusMinutes} min`, color: 'text-primary' },
          { label: 'Pausa curta', value: `${settings.breakMinutes} min`, color: 'text-emerald-400' },
          { label: 'Pausa longa', value: `${settings.longBreakMinutes} min`, color: 'text-amber-400' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <p className={cn('text-sm font-semibold', color)}>{value}</p>
            <p className="text-[11px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
