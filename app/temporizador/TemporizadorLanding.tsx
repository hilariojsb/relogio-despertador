'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  Clock,
  Hourglass,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Smartphone,
  Square,
  Target,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { GLOBAL_VOLUME_STORAGE_KEY } from '@/lib/alarm-types';
import { playAlarmSound } from '@/lib/time-utils';

type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

const DEFAULT_SECONDS = 5 * 60;
const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function readGlobalAlarmVolume(): number {
  if (typeof window === 'undefined') return 0.5;
  try {
    const raw = localStorage.getItem(GLOBAL_VOLUME_STORAGE_KEY);
    if (raw) {
      const n = parseFloat(raw);
      if (!Number.isNaN(n) && n >= 0 && n <= 1) return n;
    }
  } catch {
    /* keep default */
  }
  return 0.5;
}

function TemporizadorHeroCard() {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [duration, setDuration] = useState(DEFAULT_SECONDS);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stopSoundRef = useRef<(() => void) | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef = useRef(false);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (status !== 'finished') return;
    const volume = readGlobalAlarmVolume();
    stopSoundRef.current = playAlarmSound(isMuted ? 0 : volume);
    return () => {
      if (stopSoundRef.current) {
        stopSoundRef.current();
        stopSoundRef.current = null;
      }
    };
  }, [status, isMuted]);

  useEffect(() => {
    function handleFullscreenChange() {
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const fs = document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        setIsFullscreen(false);
        return;
      }
      setIsFullscreen(fs === cardRef.current);
    }
    handleFullscreenChange();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (status !== 'running') {
      clearTick();
      return;
    }
    firedRef.current = false;
    tickRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearTick();
          if (!firedRef.current) {
            firedRef.current = true;
            setStatus('finished');
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clearTick;
  }, [status, clearTick]);

  const start = () => {
    firedRef.current = false;
    if (secondsLeft <= 0) {
      setSecondsLeft(duration);
    }
    setStatus('running');
  };

  const pause = () => {
    setStatus('paused');
  };

  const reset = () => {
    clearTick();
    firedRef.current = false;
    if (stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
    setStatus('idle');
    setSecondsLeft(DEFAULT_SECONDS);
    setDuration(DEFAULT_SECONDS);
  };

  const addSeconds = (n: number) => {
    setSecondsLeft(s => {
      const next = s + n;
      setDuration(d => Math.max(d, next));
      return next;
    });
  };

  const addMinutes = (n: number) => {
    const add = n * 60;
    setSecondsLeft(s => {
      const next = s + add;
      setDuration(d => Math.max(d, next));
      return next;
    });
  };

  const progressPct =
    duration <= 0 ? 0 : Math.min(100, Math.max(0, ((duration - secondsLeft) / duration) * 100));
  const ringOffset = RING_C * (1 - progressPct / 100);

  const mm = pad2(Math.floor(secondsLeft / 60));
  const ss = pad2(secondsLeft % 60);
  const running = status === 'running';
  const paused = status === 'paused';
  const finished = status === 'finished';
  const digitTone = finished ? 'text-amber-900' : 'text-gray-900';

  const toggleRun = () => {
    if (finished) {
      stopAlarm();
      return;
    }
    if (running) pause();
    else start();
  };

  const primaryBtnClass = finished
    ? 'bg-rose-600 hover:bg-rose-700'
    : paused
      ? 'bg-orange-400 hover:bg-orange-500'
      : 'bg-blue-600 hover:bg-blue-700';

  const containerSurface = finished
    ? 'border border-amber-200 bg-amber-50/90'
    : paused
      ? 'border border-orange-200 bg-orange-50'
      : 'border border-gray-200 bg-white';

  const toggleFullscreen = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        const req =
          el.requestFullscreen?.bind(el) ??
          (el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.bind(el);
        void req?.();
      } else {
        const doc = document as Document & { webkitExitFullscreen?: () => void };
        if (document.exitFullscreen) void document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(false);
    }
  }, []);

  const cardShell = isFullscreen
    ? 'relative flex h-[100dvh] min-h-[100dvh] w-full flex-col items-center justify-center overflow-auto bg-gray-50 p-6 sm:p-10'
    : `relative rounded-2xl p-6 shadow-sm transition-[background-color,box-shadow,transform,border-color] duration-500 ease-out ${containerSurface}`;

  const focusInner =
    isFullscreen &&
    'flex w-full max-w-xl flex-col items-center justify-center gap-8 text-center sm:gap-8';

  const digitSize = isFullscreen
    ? 'text-7xl font-bold sm:text-8xl'
    : 'text-5xl font-bold sm:text-6xl';

  /** Fixed box so the SVG ring scales only in fullscreen; `max-w-[90vw]` avoids overflow. */
  const ringBox = isFullscreen
    ? 'mx-auto flex aspect-square h-[min(90vw,420px)] w-[min(90vw,420px)] max-h-[90vw] max-w-[90vw] shrink-0 items-center justify-center'
    : 'mx-auto flex aspect-square h-[240px] w-[240px] max-h-[min(90vw,240px)] max-w-[min(90vw,240px)] shrink-0 items-center justify-center';

  return (
    <div id="temporizador-widget" ref={cardRef} className={cardShell}>
      <div className="absolute right-4 top-4 z-30 flex items-center gap-1 sm:right-6 sm:top-6 sm:gap-2">
        <button
          type="button"
          onClick={() => setIsMuted(prev => !prev)}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-blue-600"
          aria-label={isMuted ? 'Ativar som do alerta' : 'Silenciar alerta'}
        >
          {isMuted ? <VolumeX className="h-5 w-5" strokeWidth={2} aria-hidden /> : <Volume2 className="h-5 w-5" strokeWidth={2} aria-hidden />}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-blue-600"
          aria-label={isFullscreen ? 'Sair do modo tela cheia do temporizador' : 'Tela cheia do temporizador'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          ) : (
            <Maximize2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>

      <div className={focusInner || 'w-full'}>
        {!isFullscreen && (
          <div className="flex justify-center">
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
              Temporizador
            </span>
          </div>
        )}

        <div className={`relative ${ringBox}`}>
          <svg
            className="absolute inset-0 h-full w-full -rotate-90 text-blue-600"
            viewBox="0 0 100 100"
            aria-hidden
          >
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="5"
          />
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={ringOffset}
            className={`text-blue-600 will-change-[stroke-dashoffset] ${
              status === 'running' ? 'duration-1000 ease-linear' : 'duration-500 ease-out'
            } transition-[stroke-dashoffset]`}
          />
          </svg>
          <div
            className={`relative z-10 flex max-w-[78%] items-end justify-center gap-0.5 tabular-nums tracking-tight transition-transform duration-500 ease-out ${digitSize} ${digitTone} ${
              finished ? 'scale-105' : ''
            }`}
          >
            <div className="flex min-w-0 flex-col items-center">
              <span className="leading-none">{mm}</span>
              {!isFullscreen && (
                <span className="mt-1 text-[0.65rem] font-normal tabular-nums text-gray-400">MM</span>
              )}
            </div>
            <span className={`px-0.5 leading-none text-gray-300 ${isFullscreen ? 'mb-7 sm:mb-9' : 'mb-4'}`}>:</span>
            <div className="flex min-w-0 flex-col items-center">
              <span className="leading-none">{ss}</span>
              {!isFullscreen && (
                <span className="mt-1 text-[0.65rem] font-normal tabular-nums text-gray-400">SS</span>
              )}
            </div>
          </div>
        </div>

      {!isFullscreen && (
        <p className="mt-2 text-center text-xs text-gray-500">
          {finished
            ? 'Tempo finalizado'
            : running
              ? 'Contagem em andamento'
              : paused
                ? 'Tempo pausado — toque em Continuar'
                : 'Toque em Iniciar ou use os atalhos abaixo'}
        </p>
      )}

      <div className={`flex flex-wrap justify-center gap-3 ${isFullscreen ? 'mt-2 justify-center gap-4' : 'mt-5'}`}>
        <button
          type="button"
          onClick={toggleRun}
          className={`inline-flex min-h-11 min-w-[9.5rem] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors ${primaryBtnClass}`}
        >
          {finished ? (
            <>
              <Square className="h-4 w-4 shrink-0 fill-current text-white" strokeWidth={0} aria-hidden />
              Parar
            </>
          ) : running ? (
            <>
              <Pause className="h-4 w-4 shrink-0 text-white" fill="currentColor" strokeWidth={0} aria-hidden />
              Pausar
            </>
          ) : paused ? (
            <>
              <Play className="h-4 w-4 shrink-0 fill-current text-white" strokeWidth={0} aria-hidden />
              Continuar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 shrink-0 fill-current text-white" strokeWidth={0} aria-hidden />
              Iniciar
            </>
          )}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Zerar
        </button>
      </div>

      <div className={`grid w-full max-w-md grid-cols-3 ${isFullscreen ? 'mt-8 gap-4' : 'mt-4 gap-2'}`}>
        <button
          type="button"
          disabled={finished}
          onClick={() => addSeconds(30)}
          className={`rounded-xl border border-gray-200 bg-white text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 ${
            isFullscreen ? 'py-3.5 text-sm sm:text-base' : 'py-2.5 text-xs sm:text-sm'
          }`}
        >
          +30s
        </button>
        <button
          type="button"
          disabled={finished}
          onClick={() => addMinutes(1)}
          className={`rounded-xl border border-gray-200 bg-white text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 ${
            isFullscreen ? 'py-3.5 text-sm sm:text-base' : 'py-2.5 text-xs sm:text-sm'
          }`}
        >
          +1 min
        </button>
        <button
          type="button"
          disabled={finished}
          onClick={() => addMinutes(5)}
          className={`rounded-xl border border-gray-200 bg-white text-center font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 ${
            isFullscreen ? 'py-3.5 text-sm sm:text-base' : 'py-2.5 text-xs sm:text-sm'
          }`}
        >
          +5 min
        </button>
      </div>
      </div>
    </div>
  );
}

const comoUsarSteps = [
  {
    n: 1 as const,
    title: 'Defina o tempo',
    desc: 'Digite o tempo desejado no temporizador.',
    Icon: Clock,
    isPlay: false,
  },
  {
    n: 2 as const,
    title: 'Clique em iniciar',
    desc: 'Clique em \u201cIniciar\u201d para começar a contagem.',
    Icon: Play,
    isPlay: true,
  },
  {
    n: 3 as const,
    title: 'Aguarde a contagem',
    desc: 'Acompanhe o tempo até o final.',
    Icon: Hourglass,
    isPlay: false,
  },
  {
    n: 4 as const,
    title: 'Receba o alerta',
    desc: 'Um alerta sonoro avisará quando o tempo acabar.',
    Icon: Bell,
    isPlay: false,
  },
] as const;

const porQueCards = [
  {
    title: 'Foco e produtividade',
    body: 'Blocos de tempo definidos ajudam a manter a concentração na tarefa.',
    Icon: Target,
    ring: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Controle de tempo',
    body: 'Veja exatamente quanto falta e evite passar do limite planejado.',
    Icon: Clock,
    ring: 'text-sky-600 bg-sky-50',
  },
  {
    title: 'Fácil de usar',
    body: 'Interface direta: iniciar, pausar, zerar e ajustes rápidos em um clique.',
    Icon: Zap,
    ring: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Funciona em qualquer dispositivo',
    body: 'Use no celular, tablet ou computador, direto no navegador.',
    Icon: Smartphone,
    ring: 'text-emerald-600 bg-emerald-50',
  },
] as const;

const dicasCards = [
  {
    emoji: '🍅',
    title: 'Técnica Pomodoro com timer',
    body: 'Use 25 minutos de foco e 5 minutos de pausa para mais produtividade.',
  },
  {
    emoji: '📚',
    title: 'Tempo ideal para estudos',
    body: 'Divida seus estudos em blocos de tempo e tenha mais disciplina.',
  },
  {
    emoji: '👨‍🍳',
    title: 'Controle de tempo na cozinha',
    body: 'Receitas perfeitas começam com o tempo certo.',
  },
  {
    emoji: '🏋️',
    title: 'Treinos com intervalo',
    body: 'Use o temporizador para seus treinos e intervalos com precisão.',
  },
] as const;

const maisFerramentas = [
  {
    href: '/cronometro',
    title: 'Cronômetro',
    desc: 'Mede intervalos com marcação de voltas e alta precisão.',
    header: 'bg-violet-600',
  },
  {
    href: '/despertador',
    title: 'Despertador',
    desc: 'Alarmes com horário, rótulo e volume para acordar ou lembrar tarefas.',
    header: 'bg-blue-600',
  },
  {
    href: '/pomodoro',
    title: 'Pomodoro',
    desc: 'Sessões de foco e pausa para produtividade sustentável.',
    header: 'bg-emerald-600',
  },
  {
    href: '/hora-mundial',
    title: 'Hora Mundial',
    desc: 'Compare fusos e planeje chamadas em outros países.',
    header: 'bg-orange-500',
  },
] as const;

const paraQueLista = [
  'Estudos e foco',
  'Cozinha e receitas',
  'Exercícios físicos',
  'Trabalho e reuniões',
  'Rotina diária e organização',
] as const;

const faqItems = [
  {
    q: 'O alarme toca com a aba em segundo plano?',
    a: 'Depende do navegador. Mantenha a aba aberta e o volume do sistema ativo para ouvir o alerta.',
  },
  {
    q: 'Posso pausar e continuar depois?',
    a: 'Sim. Use Pausar para interromper e Iniciar para retomar a contagem do ponto em que parou.',
  },
  {
    q: 'Como altero o tempo rapidamente?',
    a: 'Use os atalhos +30s, +1 min e +5 min para somar tempo ao temporizador.',
  },
  {
    q: 'Funciona sem instalar aplicativo?',
    a: 'Sim. Tudo roda no navegador, sem cadastro e sem download.',
  },
] as const;

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white shadow-sm">
      {faqItems.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="px-4">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 py-4 text-left text-sm font-semibold text-gray-900"
            >
              <span>{item.q}</span>
              <span className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && <p className="pb-4 text-sm leading-relaxed text-gray-500">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function TemporizadorLanding() {
  return (
    <div className="min-w-0 text-gray-900">
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="max-w-xl md:max-w-none md:pr-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">TEMPORIZADOR ONLINE</p>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-[2.5rem] lg:leading-tight">
                Temporizador <span className="text-blue-600">online</span> grátis
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600">
                Use nosso temporizador online para definir contagens regressivas com precisão. Ideal para estudos,
                cozinha, treinos e produtividade. Simples, rápido e 100% gratuito.
              </p>
              <ul className="mt-6 space-y-3 text-gray-600">
                {(
                  [
                    'Contagem regressiva precisa',
                    'Alertas sonoros configuráveis',
                    'Funciona em segundo plano',
                    '100% online e gratuito',
                  ] as const
                ).map(line => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600"
                      aria-hidden
                    >
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto w-full max-w-lg md:mx-0 md:ml-auto md:max-w-xl md:justify-self-end">
              <TemporizadorHeroCard />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Como usar o temporizador online
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
              É muito fácil definir sua contagem regressiva.
            </p>
          </div>
          <div
            className="mt-6 grid grid-cols-1 justify-items-center gap-8 md:grid-cols-4 md:justify-center"
            role="list"
            aria-label="Passos do temporizador"
          >
            {comoUsarSteps.map(s => {
              const I = s.Icon;
              return (
                <div
                  key={s.n}
                  role="listitem"
                  className="flex min-w-0 w-full max-w-sm flex-col items-center px-1 text-center sm:max-w-md md:max-w-none"
                >
                  <div className="relative mx-auto shrink-0">
                    <span className="absolute -left-1 -top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-white text-xs font-bold text-blue-600 shadow-sm">
                      {s.n}
                    </span>
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <I
                        className={`h-12 w-12 ${s.isPlay ? 'fill-current' : ''}`}
                        strokeWidth={s.isPlay ? 0 : 2}
                        aria-hidden
                      />
                    </div>
                  </div>
                  <h3 className="mt-6 w-full text-base font-bold text-gray-900 sm:text-lg">{s.title}</h3>
                  <p className="mt-2 w-full text-pretty text-sm leading-relaxed text-gray-500 [text-wrap:balance]">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Por que usar um temporizador online?
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {porQueCards.map(c => {
              const I = c.Icon;
              return (
                <div key={c.title} className="rounded-xl bg-white p-6 shadow-sm">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${c.ring}`}
                    aria-hidden
                  >
                    <I className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dicas práticas com temporizador
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {dicasCards.map(c => (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-gray-300/90 bg-white p-6 shadow-sm ring-1 ring-black/[0.04]"
              >
                <span className="select-none text-[1.75rem] leading-none" aria-hidden>
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold leading-snug text-slate-900">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Mais ferramentas para você</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {maisFerramentas.map(t => (
              <article
                key={t.href}
                className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className={`flex min-h-[3.5rem] items-center px-4 py-3 text-white ${t.header}`}>
                  <h3 className="text-base font-bold">{t.title}</h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-gray-500">{t.desc}</p>
                  <Link
                    href={t.href}
                    className="mt-5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Usar ferramenta →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-blue-50 px-6 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
            >
              Ver todas as ferramentas
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200/70 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Para que serve um temporizador?</h2>
              <p className="mt-6 max-w-[500px] text-base leading-relaxed text-gray-500">
                O temporizador é uma ferramenta versátil que ajuda você a controlar o tempo em diversas situações do
                dia a dia.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-gray-600">
                {paraQueLista.map(line => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={2.5} />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Perguntas frequentes</h2>
              <div className="mt-6">
                <FaqAccordion />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-blue-100 bg-blue-50/90 py-16 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Pronto para controlar seu tempo?</h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Use nosso temporizador online e seja mais produtivo todos os dias.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#temporizador-widget"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              Iniciar temporizador
            </a>
            <Link
              href="/"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              Ver outras ferramentas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
