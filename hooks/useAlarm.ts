'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hydrateAlarms } from '@/lib/alarm-hydration';
import type { Alarm, AlarmStatus } from '@/lib/alarm-types';
import {
  ALARMS_STORAGE_KEY_LEGACY,
  ALARM_STORAGE_KEY,
  GLOBAL_VOLUME_STORAGE_KEY,
} from '@/lib/alarm-types';
import { addMinutesToNow, isAlarmFiringForAlarm, playAlarmSound } from '@/lib/time-utils';

function sortAlarms(a: Alarm, b: Alarm): number {
  const da = a.date || '';
  const db = b.date || '';
  if (da !== db) return da.localeCompare(db);
  return a.time.localeCompare(b.time);
}

function readAlarmsFromStorage(): string | null {
  if (typeof window === 'undefined') return null;
  const primary = localStorage.getItem(ALARM_STORAGE_KEY);
  if (primary) return primary;
  const legacy = localStorage.getItem(ALARMS_STORAGE_KEY_LEGACY);
  if (legacy) {
    localStorage.setItem(ALARM_STORAGE_KEY, legacy);
    localStorage.removeItem(ALARMS_STORAGE_KEY_LEGACY);
  }
  return localStorage.getItem(ALARM_STORAGE_KEY);
}

function loadAlarmsFromStorage(): Alarm[] {
  try {
    const raw = readAlarmsFromStorage();
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return hydrateAlarms(parsed);
  } catch {
    return [];
  }
}

function endOfCurrentMinuteMs(): number {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes() + 1, 0, 0).getTime() - 1;
}

export function useAlarm() {
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
    setAlarms(loadAlarmsFromStorage());
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(GLOBAL_VOLUME_STORAGE_KEY);
      if (raw) {
        const n = parseFloat(raw);
        if (!Number.isNaN(n) && n >= 0 && n <= 1) {
          setVolume(n);
        }
      }
    } catch {
      /* keep default */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
    } catch {
      /* storage full or private mode */
    }
  }, [alarms, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(GLOBAL_VOLUME_STORAGE_KEY, String(volume));
    } catch {
      /* */
    }
  }, [volume, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const interval = window.setInterval(() => {
      const now = Date.now();
      setAlarms(prev => {
        let changed = false;
        const next = prev.map(alarm => {
          if (alarm.status === 'perdido' || alarm.status === 'concluido') {
            return alarm;
          }
          if (alarm.suppressedUntilMs != null && now < alarm.suppressedUntilMs) {
            return alarm;
          }
          let a = alarm;
          if (alarm.suppressedUntilMs != null && now >= alarm.suppressedUntilMs) {
            a = { ...alarm, suppressedUntilMs: undefined, fired: false };
            changed = true;
          }
          if (!a.enabled || a.fired) return a;
          if (isAlarmFiringForAlarm(a.time, a.date)) {
            if (!ringingIdRef.current) {
              ringingIdRef.current = a.id;
              setRingingId(a.id);
              const playVol = a.volume ?? volume;
              stopSoundRef.current = playAlarmSound(playVol);
            }
            changed = true;
            return { ...a, fired: true, status: 'ativo' as const };
          }
          return a;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [mounted, volume]);

  useEffect(() => {
    if (!mounted) return;
    const resetInterval = window.setInterval(() => {
      let clearRingingBanner = false;
      setAlarms(prev => {
        const now = new Date();
        const staleIds = prev
          .filter(a => {
            if (!a.fired) return false;
            const [h, m] = a.time.split(':').map(Number);
            const secondsSinceAlarm =
              (now.getHours() - h) * 3600 + (now.getMinutes() - m) * 60 + now.getSeconds();
            return secondsSinceAlarm > 60;
          })
          .map(a => a.id);

        if (staleIds.length === 0) return prev;

        const next = prev
          .map(a => {
            if (!staleIds.includes(a.id)) return a;
            if (a.persistent) {
              if (a.id === ringingIdRef.current) {
                if (stopSoundRef.current) {
                  stopSoundRef.current();
                  stopSoundRef.current = null;
                }
                ringingIdRef.current = null;
                clearRingingBanner = true;
              }
              const st: AlarmStatus = a.status === 'concluido' ? 'concluido' : 'ativo';
              return { ...a, fired: false, suppressedUntilMs: undefined, status: st };
            }
            if (a.id === ringingIdRef.current) {
              if (stopSoundRef.current) {
                stopSoundRef.current();
                stopSoundRef.current = null;
              }
              ringingIdRef.current = null;
              clearRingingBanner = true;
            }
            return a;
          })
          .filter(a => !staleIds.includes(a.id) || a.persistent === true);

        return next;
      });
      if (clearRingingBanner) {
        setRingingId(null);
      }
    }, 30000);
    return () => window.clearInterval(resetInterval);
  }, [mounted]);

  const stopAlarm = useCallback(() => {
    const id = ringingIdRef.current;
    if (!id) return;
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    ringingIdRef.current = null;
    setRingingId(null);
    setAlarms(prev => {
      const current = prev.find(a => a.id === id);
      if (current?.persistent) {
        return prev.map(a =>
          a.id === id
            ? { ...a, fired: false, suppressedUntilMs: endOfCurrentMinuteMs(), status: 'ativo' as const }
            : a,
        );
      }
      return prev.filter(a => a.id !== id);
    });
  }, []);

  const addAlarm = useCallback(
    (opts?: { date?: string; persistent?: boolean }) => {
      if (!inputTime) return;
      const { date, persistent } = opts ?? {};
      setAlarms(prev => {
        const alarm: Alarm = {
          id: Date.now().toString(),
          time: inputTime,
          label: inputLabel || 'Alarme',
          enabled: true,
          fired: false,
          status: 'ativo',
          volume,
          ...(date && date.length > 0 ? { date } : {}),
          ...(persistent ? { persistent: true } : {}),
        };
        return [...prev, alarm].sort(sortAlarms);
      });
      setInputTime('');
      setInputLabel('');
    },
    [inputTime, inputLabel, volume],
  );

  const addQuickAlarm = useCallback(
    (minutes: number) => {
      setAlarms(prev => {
        const time = addMinutesToNow(minutes);
        const alarm: Alarm = {
          id: Date.now().toString(),
          time,
          label: `+${minutes} min`,
          enabled: true,
          fired: false,
          status: 'ativo',
          volume,
        };
        return [...prev, alarm].sort(sortAlarms);
      });
    },
    [volume],
  );

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => {
      const next = prev.map(a => {
        if (a.id !== id) return a;
        const en = !a.enabled;
        return {
          ...a,
          enabled: en,
          fired: false,
          suppressedUntilMs: undefined,
          status: en && a.status === 'perdido' ? 'ativo' : a.status,
        };
      });
      return next;
    });
  }, []);

  const removeAlarm = useCallback((id: string) => {
    if (ringingIdRef.current === id) {
      if (stopSoundRef.current) {
        stopSoundRef.current();
        stopSoundRef.current = null;
      }
      ringingIdRef.current = null;
      setRingingId(null);
    }
    setAlarms(prev => prev.filter(a => a.id !== id));
  }, []);

  const enabledCount = useMemo(
    () => alarms.filter(a => a.enabled && a.status !== 'perdido' && a.status !== 'concluido').length,
    [alarms],
  );

  return {
    mounted,
    alarms,
    volume,
    setVolume,
    inputTime,
    setInputTime,
    inputLabel,
    setInputLabel,
    ringingId,
    stopAlarm,
    addAlarm,
    addQuickAlarm,
    toggleAlarm,
    removeAlarm,
    enabledCount,
  } as const;
}
