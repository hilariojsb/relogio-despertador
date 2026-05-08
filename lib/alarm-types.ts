export type AlarmStatus = 'ativo' | 'perdido' | 'concluido';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  fired: boolean;
  /** Snapshot of UI volume (0–1) when the alarm was created. Playback uses this, then the global slider. */
  volume?: number;
  /** YYYY-MM-DD (local calendar). When set, the alarm only fires on that day at `time`. */
  date?: string;
  /** When true, the alarm is not removed when the user stops the ringing. */
  persistent?: boolean;
  /** While set and `Date.now()` is before this, do not re-trigger (same-minute guard after dismiss). */
  suppressedUntilMs?: number;
  /** Set on load for dated alarms in the past; optional for UX. */
  status?: AlarmStatus;
}

/** Primary key (legacy users). Also migrates from `alarms` if present. */
export const ALARM_STORAGE_KEY = 'timeos_alarms';
export const ALARMS_STORAGE_KEY_LEGACY = 'alarms';
export const GLOBAL_VOLUME_STORAGE_KEY = 'timeos_alarm_volume';
