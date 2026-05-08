import type { Alarm, AlarmStatus } from '@/lib/alarm-types';
import { todayISODateLocal } from '@/lib/time-utils';

function isTimeInPastForToday(time: string): boolean {
  const p = time.split(':').map(Number);
  const h = p[0];
  const m = p[1];
  if (Number.isNaN(h) || Number.isNaN(m)) return false;
  const d = new Date();
  if (d.getHours() > h) return true;
  if (d.getHours() < h) return false;
  return d.getMinutes() > m;
}

function resolveStatus(a: Alarm, today: string): AlarmStatus {
  if (a.status === 'concluido') return 'concluido';
  if (a.date) {
    if (a.date < today) return 'perdido';
    if (a.date > today) return 'ativo';
    if (a.date === today) {
      if (!a.fired && isTimeInPastForToday(a.time)) return 'perdido';
      return 'ativo';
    }
  }
  if (a.status && a.status !== 'perdido') return a.status;
  return 'ativo';
}

/**
 * After loading from localStorage: normalize fields and mark dated alarms that are no longer eligible.
 */
export function hydrateAlarms(list: unknown): Alarm[] {
  if (!Array.isArray(list)) return [];
  const today = todayISODateLocal();
  return list
    .filter(
      (x): x is Record<string, unknown> =>
        x != null && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string',
    )
    .map(raw => {
      const a = raw as unknown as Alarm;
      const status = resolveStatus(a, today);
      const enabledBase = typeof a.enabled === 'boolean' ? a.enabled : true;
      return {
        ...a,
        status,
        label: typeof a.label === 'string' ? a.label : 'Alarme',
        time: typeof a.time === 'string' ? a.time : '00:00',
        enabled: status === 'perdido' ? false : enabledBase,
        fired: typeof a.fired === 'boolean' ? a.fired : false,
      };
    });
}
