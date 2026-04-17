export function formatTime(date: Date, seconds = true): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return seconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}

export function formatDuration(ms: number, showMs = false): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const millis = Math.floor((ms % 1000) / 10);

  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(secs).padStart(2, '0');
  const ms2 = String(millis).padStart(2, '0');

  if (hours > 0) {
    return showMs ? `${h}:${m}:${s}.${ms2}` : `${h}:${m}:${s}`;
  }
  return showMs ? `${m}:${s}.${ms2}` : `${m}:${s}`;
}

export function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export function getTimeUntilAlarm(alarmTime: string): number {
  const now = new Date();
  const parsed = parseTimeString(alarmTime);
  if (!parsed) return -1;

  const alarm = new Date();
  alarm.setHours(parsed.hours, parsed.minutes, 0, 0);

  if (alarm <= now) {
    alarm.setDate(alarm.getDate() + 1);
  }

  return alarm.getTime() - now.getTime();
}

export function isAlarmFiring(alarmTime: string): boolean {
  const now = new Date();
  const parsed = parseTimeString(alarmTime);
  if (!parsed) return false;

  return now.getHours() === parsed.hours && now.getMinutes() === parsed.minutes;
}

export function addMinutesToNow(minutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return formatter.format(now);
  } catch {
    return '--:--:--';
  }
}

export function getDateInTimezone(timezone: string): string {
  try {
    const now = new Date();
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }).format(now);
  } catch {
    return '';
  }
}

export function playAlarmSound(volume = 0.5): () => void {
  if (typeof window === 'undefined') return () => {};

  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  let stopped = false;

  function playBeep() {
    if (stopped) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime + 0.3);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);

    oscillator.onended = () => {
      if (!stopped) {
        setTimeout(playBeep, 300);
      }
    };
  }

  playBeep();

  return () => {
    stopped = true;
    ctx.close();
  };
}
