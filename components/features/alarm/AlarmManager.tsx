'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, BellOff, Plus, Trash2, Volume2, AlarmClock } from 'lucide-react';
import { addMinutesToNow, isAlarmFiring, playAlarmSound } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  fired: boolean;
}

const STORAGE_KEY = 'timeos_alarms';

function loadAlarms(): Alarm[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlarms(alarms: Alarm[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
}

export default function AlarmManager() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [inputTime, setInputTime] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [ringingId, setRingingId] = useState<string | null>(null);
  const ringingIdRef = useRef<string | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAlarms(loadAlarms());
  }, []);

  const updateAlarms = useCallback((updated: Alarm[]) => {
    setAlarms(updated);
    saveAlarms(updated);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = window.setInterval(() => {
      setAlarms(prev => {
        let changed = false;
        const next = prev.map(alarm => {
          if (!alarm.enabled || alarm.fired) return alarm;
          if (isAlarmFiring(alarm.time)) {
            if (!ringingIdRef.current) {
              ringingIdRef.current = alarm.id;
              setRingingId(alarm.id);
              stopSoundRef.current = playAlarmSound(volume);
            }
            changed = true;
            return { ...alarm, fired: true };
          }
          return alarm;
        });
        if (changed) saveAlarms(next);
        return changed ? next : prev;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mounted, volume]);

  useEffect(() => {
    if (!mounted) return;
    const resetInterval = window.setInterval(() => {
      setAlarms(prev => {
        const now = new Date();
        const needsReset = prev.some(a => {
          if (!a.fired) return false;
          const [h, m] = a.time.split(':').map(Number);
          const secondsSinceAlarm =
            (now.getHours() - h) * 3600 + (now.getMinutes() - m) * 60 + now.getSeconds();
          return secondsSinceAlarm > 60;
        });
        if (!needsReset) return prev;
        const next = prev.map(a => (a.fired ? { ...a, fired: false } : a));
        saveAlarms(next);
        return next;
      });
    }, 30000);
    return () => window.clearInterval(resetInterval);
  }, [mounted]);

  function stopAlarm() {
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    ringingIdRef.current = null;
    setRingingId(null);
  }

  function addAlarm() {
    if (!inputTime) return;
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: inputTime,
      label: inputLabel || 'Alarme',
      enabled: true,
      fired: false,
    };
    const next = [...alarms, alarm].sort((a, b) => a.time.localeCompare(b.time));
    updateAlarms(next);
    setInputTime('');
    setInputLabel('');
  }

  function addQuickAlarm(minutes: number) {
    const time = addMinutesToNow(minutes);
    const alarm: Alarm = {
      id: Date.now().toString(),
      time,
      label: `+${minutes} min`,
      enabled: true,
      fired: false,
    };
    const next = [...alarms, alarm].sort((a, b) => a.time.localeCompare(b.time));
    updateAlarms(next);
  }

  function toggleAlarm(id: string) {
    const next = alarms.map(a => (a.id === id ? { ...a, enabled: !a.enabled, fired: false } : a));
    updateAlarms(next);
  }

  function removeAlarm(id: string) {
    if (ringingId === id) stopAlarm();
    updateAlarms(alarms.filter(a => a.id !== id));
  }

  if (!mounted) return null;

  return (
    <div className="w-full space-y-6">
      {ringingId && (
        <div className="animate-scale-in rounded-2xl border border-destructive/30 bg-destructive p-6 text-center text-destructive-foreground shadow-lg animate-alarm-pulse">
          <div className="flex flex-col items-center gap-3">
            <p className="text-base font-semibold text-white">⏰ Alarme tocando</p>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <AlarmClock className="h-7 w-7 text-white" aria-hidden />
            </div>
            <p className="text-lg font-semibold text-white">
              {alarms.find(a => a.id === ringingId)?.label || 'Alarme'}
            </p>
            <p className="text-sm text-white/90">
              {alarms.find(a => a.id === ringingId)?.time}
            </p>
            <button
              type="button"
              onClick={stopAlarm}
              className="mt-1 min-h-[48px] rounded-xl bg-white px-8 py-3 text-sm font-semibold text-destructive shadow-md transition-transform hover:bg-white/90 active:scale-[0.98]"
            >
              Parar alarme
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel space-y-4 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
          <Bell className="h-4 w-4 text-primary" aria-hidden />
          Adicionar alarme
        </h2>

        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {[5, 10, 30].map(min => (
            <button
              key={min}
              type="button"
              onClick={() => addQuickAlarm(min)}
              className="min-h-[44px] flex-1 rounded-xl border border-border bg-muted/50 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/35 hover:bg-primary/10 active:scale-[0.98] sm:min-h-0"
            >
              +{min} min
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <input
            type="time"
            value={inputTime}
            onChange={e => setInputTime(e.target.value)}
            className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors [color-scheme:light] focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:[color-scheme:dark]"
          />
          <input
            type="text"
            value={inputLabel}
            onChange={e => setInputLabel(e.target.value)}
            placeholder="Rótulo (opcional)"
            className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={addAlarm}
            disabled={!inputTime}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35 active:scale-[0.98]"
            aria-label="Adicionar alarme"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-primary"
          />
          <span className="w-9 text-right text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {alarms.length > 0 && (
        <div className="space-y-2">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Alarmes ativos ({alarms.filter(a => a.enabled).length})
          </h2>
          <ul className="space-y-2">
            {alarms.map(alarm => (
              <li
                key={alarm.id}
                className={cn(
                  'flex min-h-[52px] items-center justify-between rounded-xl border px-4 py-3 transition-colors animate-fade-in',
                  alarm.id === ringingId
                    ? 'border-destructive/50 bg-destructive/10'
                    : alarm.enabled
                      ? 'border-border bg-muted/40 hover:bg-muted/70'
                      : 'border-border/60 bg-muted/20 opacity-50'
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleAlarm(alarm.id)}
                    className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted sm:min-h-0 sm:min-w-0"
                    aria-label={alarm.enabled ? 'Desativar' : 'Ativar'}
                  >
                    {alarm.enabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="clock-digit text-base font-semibold text-foreground">{alarm.time}</p>
                    <p className="truncate text-xs text-muted-foreground">{alarm.label}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAlarm(alarm.id)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:min-h-0 sm:min-w-0 sm:p-1.5"
                  aria-label="Remover alarme"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alarms.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Bell className="h-9 w-9 text-muted-foreground/40" aria-hidden />
          <p className="text-sm text-muted-foreground">Nenhum alarme configurado</p>
        </div>
      )}
    </div>
  );
}
