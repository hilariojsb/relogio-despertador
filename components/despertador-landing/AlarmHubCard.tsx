'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Bell, MoreVertical, Plus, Trash2, Volume2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAlarm } from '@/hooks/useAlarm';
import { addMinutesToNow, formatAlarmDateLabel, todayISODateLocal } from '@/lib/time-utils';
import { cn } from '@/lib/utils';

const DEFAULT_QUICK_PRESETS = [5, 10, 30] as const;

export type AlarmHubCardHandle = {
  /** Adiciona imediatamente alarme relative +minutes (rótulo +N min). */
  addQuickMinutes: (minutes: number) => void;
  /** Abre o fluxo “Adicionar alarme” já com tempo preenchido. */
  presetFormMinutes: (minutes: number, label?: string) => void;
};

export type AlarmHubCardProps = {
  /** Ao montar: abre formulário com horário = agora + N minutos. */
  presetRelativeMinutes?: number;
  presetLabelSuggestion?: string;
  /** Botões rápidos +N min (default 5 / 10 / 30 na home). */
  quickMinutePresets?: readonly number[];
};

export const AlarmHubCard = forwardRef<AlarmHubCardHandle, AlarmHubCardProps>(function AlarmHubCard(
  { presetRelativeMinutes, presetLabelSuggestion, quickMinutePresets },
  ref,
) {
  const timeInputRef = useRef<HTMLInputElement>(null);
  const formRegionRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [useDate, setUseDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPersistent, setIsPersistent] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const a = useAlarm();
  const aRef = useRef(a);
  aRef.current = a;

  const quickList = useMemo(
    () => Array.from(new Set(quickMinutePresets ?? [...DEFAULT_QUICK_PRESETS])).sort((x, y) => x - y),
    [quickMinutePresets],
  );

  const presetAppliedRef = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      addQuickMinutes(minutes: number) {
        aRef.current.addQuickAlarm(minutes);
      },
      presetFormMinutes(minutes: number, label?: string) {
        setUseDate(false);
        setSelectedDate(null);
        setIsPersistent(false);
        aRef.current.setInputTime(addMinutesToNow(minutes));
        aRef.current.setInputLabel(label ?? '');
        setActivePreset(quickList.includes(minutes) ? minutes : null);
        setIsCreating(true);
      },
    }),
    [quickList],
  );

  useEffect(() => {
    if (!a.mounted || presetRelativeMinutes == null || presetAppliedRef.current) return;
    if (presetRelativeMinutes <= 0) return;
    presetAppliedRef.current = true;
    const qp = quickList;
    a.setInputTime(addMinutesToNow(presetRelativeMinutes));
    if (presetLabelSuggestion != null && presetLabelSuggestion !== '') {
      a.setInputLabel(presetLabelSuggestion);
    }
    setActivePreset(qp.includes(presetRelativeMinutes) ? presetRelativeMinutes : null);
    setIsCreating(true);
  }, [a.mounted, presetRelativeMinutes, presetLabelSuggestion, quickList, a]);

  useEffect(() => {
    if (!isCreating) return;
    const id = requestAnimationFrame(() => {
      timeInputRef.current?.focus();
      timeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => cancelAnimationFrame(id);
  }, [isCreating]);

  useEffect(() => {
    const el = formRegionRef.current;
    if (!el) return;
    if (isCreating) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [isCreating]);

  const openCreate = () => {
    setUseDate(false);
    setSelectedDate(null);
    setIsPersistent(false);
    setActivePreset(null);
    setIsCreating(true);
  };

  const closeCreate = () => {
    setIsCreating(false);
    setUseDate(false);
    setSelectedDate(null);
    setIsPersistent(false);
    setActivePreset(null);
  };

  const handleConfirmAdd = () => {
    if (!a.inputTime) return;
    const day = useDate ? (selectedDate && selectedDate.length > 0 ? selectedDate : todayISODateLocal()) : undefined;
    a.addAlarm({
      ...(day ? { date: day } : {}),
      ...(isPersistent ? { persistent: true } : {}),
    });
    setIsCreating(false);
    setUseDate(false);
    setSelectedDate(null);
    setIsPersistent(false);
    setActivePreset(null);
  };

  const selectPresetMinutes = (min: number) => {
    a.setInputTime(addMinutesToNow(min));
    setActivePreset(min);
  };

  if (!a.mounted) {
    return (
      <div
        className="min-h-[20rem] w-full animate-pulse rounded-[1.25rem] border border-slate-200/60 bg-white p-6 shadow-sm sm:p-7"
        aria-hidden
      />
    );
  }

  return (
    <div className="group/card relative w-full min-w-0 max-w-full overflow-hidden rounded-[1.25rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-900/5 transition-shadow duration-300 ease-out sm:p-7 sm:hover:shadow-md sm:hover:shadow-slate-900/8">
      {a.ringingId && (
        <div className="mb-5 rounded-xl border border-rose-200/60 bg-gradient-to-b from-rose-50 to-rose-50/50 p-4 text-center shadow-sm sm:p-5">
          <p className="text-sm font-bold text-rose-900 sm:text-base">⏰ Alarme tocando</p>
          <p className="mt-0.5 text-sm font-semibold text-rose-800">
            {a.alarms.find(x => x.id === a.ringingId)?.label ?? 'Alarme'} · {a.alarms.find(x => x.id === a.ringingId)?.time}
          </p>
          <button
            type="button"
            onClick={a.stopAlarm}
            className="mt-3 w-full min-h-11 max-w-xs rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition-all duration-200 ease-out hover:bg-rose-700 hover:shadow-lg active:scale-[0.99] motion-reduce:transition-none"
          >
            Parar alarme
          </button>
        </div>
      )}

      <div className="flex min-w-0 items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-left text-[0.9375rem] font-bold tracking-tight text-slate-900 sm:text-base">Seus alarmes</h2>
        <span className="shrink-0 rounded-full border border-emerald-200/40 bg-emerald-100/90 px-2.5 py-0.5 text-center text-xs font-semibold text-emerald-800 tabular-nums shadow-sm sm:px-3 sm:py-1 sm:text-[0.8125rem]">
          {a.enabledCount} {a.enabledCount === 1 ? 'ativo' : 'ativos'}
        </span>
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" aria-hidden />

      <div
        className="mt-5 min-h-0 max-h-64 overflow-y-auto pr-0.5 [scrollbar-gutter:stable] sm:mt-6"
        role="list"
        aria-label="Lista de alarmes"
      >
        {a.alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50/80 text-slate-400 shadow-sm transition-colors duration-200 group-hover/card:border-slate-200">
              <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Nenhum alarme ainda. Toque em &ldquo;Adicionar alarme&rdquo; abaixo para começar.
            </p>
          </div>
        )}

        {a.alarms.length > 0 && (
          <ul className="max-w-full space-y-0">
            {a.alarms.map((alarm, index) => (
              <li
                key={alarm.id}
                className={cn(
                  'min-w-0 max-w-full border-b border-slate-100/90 py-4 last:border-0 last:pb-0',
                  index === 0 && 'pt-1',
                )}
              >
                <div className="-mx-1 flex w-full min-w-0 max-w-full items-start gap-3 rounded-xl px-1 transition-colors duration-200 ease-out sm:gap-4 sm:hover:bg-slate-50/60">
                  <div className="min-w-0 max-w-full flex-1">
                    <p
                      className={cn(
                        'font-extrabold leading-none tabular-nums text-slate-950',
                        a.alarms.length === 1
                          ? 'text-[2.5rem] tracking-[-0.03em] sm:text-[2.625rem] md:text-[2.75rem]'
                          : 'text-2xl sm:text-3xl',
                      )}
                    >
                      {alarm.time}
                    </p>
                    <p className="mt-2.5 min-w-0 break-words text-left text-sm font-medium leading-snug text-slate-800 sm:mt-3 sm:text-[0.9375rem]">
                      {alarm.label}
                    </p>
                    {((alarm.date || a.alarms.length === 1) || alarm.status === 'perdido' || alarm.status === 'concluido') && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-left">
                        {(alarm.date || a.alarms.length === 1) && (
                          <p className="text-xs font-medium leading-relaxed text-slate-500">
                            {alarm.date ? formatAlarmDateLabel(alarm.date) : 'Todos os dias'}
                          </p>
                        )}
                        {alarm.status === 'perdido' && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-900">
                            Perdido
                          </span>
                        )}
                        {alarm.status === 'concluido' && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600">
                            Concluído
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2.5 pt-1">
                    <Switch
                      checked={alarm.enabled}
                      disabled={alarm.status === 'perdido' || alarm.status === 'concluido'}
                      onCheckedChange={() => a.toggleAlarm(alarm.id)}
                      className="transition-shadow duration-200 data-[state=checked]:bg-blue-600 data-[state=checked]:shadow-sm data-[state=checked]:shadow-blue-600/25 data-[state=unchecked]:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 ease-out hover:bg-slate-100/90 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2"
                          title="Ações do alarme"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[8rem]">
                        <DropdownMenuItem
                          className="text-rose-600 focus:text-rose-700"
                          onSelect={() => a.removeAlarm(alarm.id)}
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isCreating && (
        <div className="mt-8 sm:mt-9">
          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-[3.25rem] w-full min-w-0 max-w-full touch-manipulation items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-slate-200/95 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-600 shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:border-slate-300/95 hover:bg-slate-50/90 hover:text-slate-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 active:translate-y-0 sm:min-h-[3.5rem] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Plus className="h-5 w-5 shrink-0 text-[#0052FF] opacity-95" strokeWidth={2.35} aria-hidden />
            <span>Adicionar alarme</span>
          </button>
        </div>
      )}

      <div
        className={cn(
          'grid w-full min-w-0',
          isCreating && 'mt-5 sm:mt-6',
          'transition-[grid-template-rows] duration-200 ease-out',
          isCreating ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          'motion-reduce:transition-none',
        )}
        aria-hidden={!isCreating}
      >
        <div ref={formRegionRef} className="min-h-0 overflow-hidden">
          <div
            id="bloco-adicionar-alarme"
            className="space-y-3.5 rounded-xl border border-slate-200/50 bg-slate-50/80 p-4 sm:space-y-4 sm:p-5"
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <p className="min-w-0 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">Novo alarme</p>
              <button
                type="button"
                onClick={closeCreate}
                className="shrink-0 text-xs font-medium text-slate-500 transition-colors duration-200 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2"
              >
                Cancelar
              </button>
            </div>
            <div
              className={cn(
                'grid w-full min-w-0 gap-2 sm:gap-2.5',
                quickList.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3',
              )}
            >
              {quickList.map(min => (
                <button
                  key={min}
                  type="button"
                  onClick={() => selectPresetMinutes(min)}
                  className={cn(
                    'min-h-9 min-w-0 touch-manipulation rounded-full border bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                    activePreset === min
                      ? 'border-blue-400 bg-blue-100 hover:border-blue-500 hover:bg-blue-100/90'
                      : 'border-slate-200/60 hover:border-slate-200 hover:bg-white',
                  )}
                >
                  +{min} min
                </button>
              ))}
            </div>
            <div className="flex w-full min-w-0 flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-2.5">
              <input
                id="despertador-alarm-time-input"
                ref={timeInputRef}
                type="time"
                value={a.inputTime}
                onChange={e => {
                  a.setInputTime(e.target.value);
                  setActivePreset(null);
                }}
                className="min-h-11 min-w-0 flex-1 touch-manipulation rounded-xl border border-slate-200/90 bg-white py-2.5 text-center text-lg font-semibold tabular-nums text-slate-900 shadow-sm transition-all duration-200 [color-scheme:light] hover:border-slate-300/90 sm:min-h-12 sm:text-xl sm:leading-8 focus:border-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 dark:[color-scheme:dark]"
              />
              <input
                type="text"
                value={a.inputLabel}
                onChange={e => a.setInputLabel(e.target.value)}
                placeholder="Rótulo (opcional)"
                className="min-h-11 min-w-0 flex-1 touch-manipulation rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm leading-normal text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-300/90 sm:min-h-12 placeholder:text-slate-400 focus:border-blue-300/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={handleConfirmAdd}
                disabled={!a.inputTime}
                className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-500/20 transition-all duration-200 ease-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-sm motion-safe:enabled:hover:scale-[1.04] motion-safe:enabled:active:scale-95"
                aria-label="Confirmar e adicionar alarme"
              >
                <Plus className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>

            <div className="min-w-0 border-t border-slate-200/50 pt-3.5 sm:pt-4">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="despertador-use-date"
                  checked={useDate}
                  onCheckedChange={v => {
                    const on = v === true;
                    setUseDate(on);
                    if (on) setSelectedDate(s => s ?? todayISODateLocal());
                    else setSelectedDate(null);
                  }}
                  className="shrink-0 border-slate-300/90 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <label
                  htmlFor="despertador-use-date"
                  className="min-w-0 flex-1 cursor-pointer select-none text-sm font-medium leading-5 text-slate-600"
                >
                  Definir data específica
                </label>
              </div>
              <div
                className={cn(
                  'grid w-full min-w-0 pl-6 transition-[grid-template-rows] duration-200 ease-out',
                  useDate ? 'mt-2.5 grid-rows-[1fr] sm:mt-3' : 'mt-0 grid-rows-[0fr]',
                  'motion-reduce:transition-none',
                )}
                aria-hidden={!useDate}
              >
                <div className="min-h-0 max-w-[18rem] overflow-hidden">
                  <input
                    type="date"
                    value={selectedDate ?? ''}
                    onChange={e => setSelectedDate(e.target.value || null)}
                    className="h-10 w-full min-w-0 rounded-lg border border-slate-200/90 bg-white px-3 text-sm font-normal tabular-nums leading-none text-slate-800 shadow-sm [color-scheme:light] transition-colors duration-200 hover:border-slate-300/80 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/15 dark:[color-scheme:dark]"
                    min={todayISODateLocal()}
                    aria-label="Data do alarme"
                  />
                </div>
              </div>
            </div>

            <div className="min-w-0 border-t border-slate-200/50 pt-3.5 sm:pt-4">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="despertador-persistent-alarm"
                  checked={isPersistent}
                  onCheckedChange={v => setIsPersistent(v === true)}
                  className="shrink-0 border-slate-300/90 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                />
                <label
                  htmlFor="despertador-persistent-alarm"
                  className="min-w-0 flex-1 cursor-pointer select-none text-sm font-medium leading-5 text-slate-600"
                >
                  Manter alarme após parar
                </label>
              </div>
            </div>

            <div className="flex w-full min-w-0 items-center gap-3 border-t border-slate-200/50 pt-3.5 sm:pt-4">
              <Volume2 className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={a.volume}
                onChange={e => a.setVolume(parseFloat(e.target.value))}
                className="h-1.5 min-w-0 flex-1 cursor-pointer rounded-full bg-slate-200/90 accent-blue-600 transition-[filter] duration-200 hover:brightness-95"
              />
              <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-slate-500">
                {Math.round(a.volume * 100)}%
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Mantenha a aba aberta para o alerta. O volume define o som do toque.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

AlarmHubCard.displayName = 'AlarmHubCard';
