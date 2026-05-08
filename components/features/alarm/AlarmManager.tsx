'use client';

import { useState } from 'react';
import { Bell, BellOff, Plus, Trash2, Volume2, AlarmClock } from 'lucide-react';
import { useAlarm } from '@/hooks/useAlarm';
import { addMinutesToNow, formatAlarmDateLabel } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

export default function AlarmManager() {
  const a = useAlarm();
  if (!a.mounted) return null;
  return <AlarmManagerUI {...a} />;
}

type AlarmViewProps = ReturnType<typeof useAlarm>;
function AlarmManagerUI(a: AlarmViewProps) {
  const [activePreset, setActivePreset] = useState<5 | 10 | 30 | null>(null);

  return (
    <div className="w-full space-y-6">
      {a.ringingId && (
        <div className="animate-scale-in rounded-2xl border border-destructive/30 bg-destructive p-6 text-center text-destructive-foreground shadow-lg animate-alarm-pulse">
          <div className="flex flex-col items-center gap-3">
            <p className="text-base font-semibold text-white">⏰ Alarme tocando</p>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <AlarmClock className="h-7 w-7 text-white" aria-hidden />
            </div>
            <p className="text-lg font-semibold text-white">
              {a.alarms.find(al => al.id === a.ringingId)?.label || 'Alarme'}
            </p>
            <p className="text-sm text-white/90">
              {a.alarms.find(al => al.id === a.ringingId)?.time}
            </p>
            <button
              type="button"
              onClick={a.stopAlarm}
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
          {([5, 10, 30] as const).map(min => (
            <button
              key={min}
              type="button"
              onClick={() => {
                a.setInputTime(addMinutesToNow(min));
                setActivePreset(min);
              }}
              className={cn(
                'min-h-[44px] flex-1 rounded-xl border py-2.5 text-sm font-semibold text-foreground transition-all active:scale-[0.98] sm:min-h-0',
                activePreset === min
                  ? 'border-blue-400 bg-blue-100 hover:border-blue-500 hover:bg-blue-100/90'
                  : 'border-border bg-muted/50 hover:border-primary/35 hover:bg-primary/10',
              )}
            >
              +{min} min
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <input
            type="time"
            value={a.inputTime}
            onChange={e => {
              a.setInputTime(e.target.value);
              setActivePreset(null);
            }}
            className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors [color-scheme:light] focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:[color-scheme:dark]"
          />
          <input
            type="text"
            value={a.inputLabel}
            onChange={e => a.setInputLabel(e.target.value)}
            placeholder="Rótulo (opcional)"
            className="min-h-[44px] flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => {
              a.addAlarm();
              setActivePreset(null);
            }}
            disabled={!a.inputTime}
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
            value={a.volume}
            onChange={e => a.setVolume(parseFloat(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-primary"
          />
          <span className="w-9 text-right text-xs text-muted-foreground">{Math.round(a.volume * 100)}%</span>
        </div>
      </div>

      {a.alarms.length > 0 && (
        <div className="space-y-2">
          <h2 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Alarmes ativos ({a.enabledCount})
          </h2>
          <ul className="space-y-2">
            {a.alarms.map(alarm => (
              <li
                key={alarm.id}
                className={cn(
                  'flex min-h-[52px] items-center justify-between rounded-xl border px-4 py-3 transition-colors animate-fade-in',
                  alarm.id === a.ringingId
                    ? 'border-destructive/50 bg-destructive/10'
                    : alarm.enabled
                      ? 'border-border bg-muted/40 hover:bg-muted/70'
                      : 'border-border/60 bg-muted/20 opacity-50'
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => a.toggleAlarm(alarm.id)}
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
                    {alarm.date && (
                      <p className="text-[0.7rem] text-muted-foreground/80">{formatAlarmDateLabel(alarm.date)}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => a.removeAlarm(alarm.id)}
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

      {a.alarms.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Bell className="h-9 w-9 text-muted-foreground/40" aria-hidden />
          <p className="text-sm text-muted-foreground">Nenhum alarme configurado</p>
        </div>
      )}
    </div>
  );
}
