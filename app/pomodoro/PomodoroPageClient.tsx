"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AlarmClock,
  Ban,
  Brain,
  Calendar,
  Check,
  Clock,
  Coffee,
  ExternalLink,
  Globe,
  Hourglass,
  Lightbulb,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings2,
  Sparkles,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";
import { PomodoroGuiaSection } from "@/components/pomodoro/PomodoroGuiaSection";
import { usePomodoro } from "@/hooks/usePomodoro";
import { cn } from "@/lib/utils";

const BLUE = "#2563EB";
const GREEN = "#22C55E";
const TEXT = "#0F172A";
const TEXT_SEC = "#475569";
/** Fundo exclusivo do container principal da página Pomodoro (não reutilizar em seções/cards). */
const POMODORO_PAGE_WRAPPER_BG = "#EDEFF3";
const PAGE_BG = "#F8FAFC";
const BORDER = "#E2E8F0";
const SECTION_SOFT = "#F1F5F9";

/** Card hero: viewBox 280 — anel ligeiramente fino, raio ajustado para o traço não tocar a borda. */
const RING_SVG = 280;
const RING_CX = 140;
const RING_CY = 140;
const RING = 126;
const RING_STROKE = 5;
const RING_C = 2 * Math.PI * RING;
const RING_TRACK = "#E5EAF2";
const RING_COLOR_FOCUS = "#10B981";

const BADGE_BLUE_BG = "#EFF6FF";
/** Texto grande do timer (estilo ref. produto) */
const TOOL_TIME_COLOR = "#1E293B";

const CARD_BENEFITS_BG = "#F0FDF4";
const CARD_BENEFITS_BORDER = "#DCFCE7";
const CARD_TIPS_BG = "#FFFBEB";
const CARD_TIPS_BORDER = "#FEF3C7";
/** Preferências (min/ciclos) — independente do snapshot de sessão. */
const POMODORO_PREFS_STORAGE_KEY = "pomodoro_session_preferences";

type PomodoroPrefs = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cycles: number;
};

function readPomodoroPrefsFromStorage(): PomodoroPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(POMODORO_PREFS_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (
      typeof p.focusDuration === "number" &&
      Number.isFinite(p.focusDuration) &&
      typeof p.shortBreakDuration === "number" &&
      Number.isFinite(p.shortBreakDuration) &&
      typeof p.longBreakDuration === "number" &&
      Number.isFinite(p.longBreakDuration) &&
      typeof p.cycles === "number" &&
      Number.isFinite(p.cycles)
    ) {
      return {
        focusDuration: p.focusDuration,
        shortBreakDuration: p.shortBreakDuration,
        longBreakDuration: p.longBreakDuration,
        cycles: p.cycles,
      };
    }
  } catch {
    /* */
  }
  return null;
}

function writePomodoroPrefsToStorage(prefs: PomodoroPrefs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      POMODORO_PREFS_STORAGE_KEY,
      JSON.stringify({
        focusDuration: prefs.focusDuration,
        shortBreakDuration: prefs.shortBreakDuration,
        longBreakDuration: prefs.longBreakDuration,
        cycles: prefs.cycles,
      }),
    );
  } catch {
    /* */
  }
}

/** Pausa curta — anel e badge: azul suave (apenas cor, sem mudar layout) */
const RING_COLOR_SHORT = "#38BDF8";
/** Pausa longa — roxo suave */
const RING_COLOR_LONG = "#9D7DFF";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTimeSecs(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${pad2(m)}:${pad2(r)}`;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function getNextStateIcon(
  state: "idle" | "focus" | "short_break" | "long_break",
): LucideIcon {
  if (state === "focus") return Coffee;
  return Target;
}

export default function PomodoroPageClient() {
  const [focusMin, setFocusMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [cyclesTotal, setCyclesTotal] = useState(4);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draftFocus, setDraftFocus] = useState(25);
  const [draftShort, setDraftShort] = useState(5);
  const [draftLong, setDraftLong] = useState(15);
  const [draftCycles, setDraftCycles] = useState(4);
  const [configApplied, setConfigApplied] = useState(false);

  useLayoutEffect(() => {
    const p = readPomodoroPrefsFromStorage();
    if (!p) return;
    setFocusMin(clampInt(p.focusDuration, 1, 90));
    setShortMin(clampInt(p.shortBreakDuration, 1, 30));
    setLongMin(clampInt(p.longBreakDuration, 5, 60));
    setCyclesTotal(clampInt(p.cycles, 2, 8));
  }, []);

  useEffect(() => {
    if (!isCustomizing) return;
    setDraftFocus(focusMin);
    setDraftShort(shortMin);
    setDraftLong(longMin);
    setDraftCycles(cyclesTotal);
  }, [isCustomizing, focusMin, shortMin, longMin, cyclesTotal]);

  const pomo = usePomodoro(focusMin, shortMin, longMin, cyclesTotal);
  const {
    currentState,
    timeRemaining,
    currentCycle,
    totalCycles: totalCycleCount,
    isRunning: running,
    segment,
    progress,
    isPausedLook,
    startPomodoro: start,
    pausePomodoro,
    resetPomodoro: resetAll,
    onToolPointerDown,
  } = pomo;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toolCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function syncFs() {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const fs =
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        setIsFullscreen(false);
        return;
      }
      setIsFullscreen(fs === toolCardRef.current);
    }
    syncFs();
    document.addEventListener("fullscreenchange", syncFs);
    document.addEventListener("webkitfullscreenchange", syncFs);
    return () => {
      document.removeEventListener("fullscreenchange", syncFs);
      document.removeEventListener("webkitfullscreenchange", syncFs);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isFullscreen) {
      document.body.classList.add("pomodoro-tool-fullscreen");
    } else {
      document.body.classList.remove("pomodoro-tool-fullscreen");
    }
    return () => {
      document.body.classList.remove("pomodoro-tool-fullscreen");
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = toolCardRef.current;
      if (!el) return;
      const doc = document as Document & { webkitFullscreenElement?: Element | null };
      const active =
        document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      if (active !== el) return;
      if (document.exitFullscreen) {
        void document.exitFullscreen();
        return;
      }
      (document as Document & { webkitExitFullscreen?: () => void })
        .webkitExitFullscreen?.();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isFullscreen]);

  const toggleCardFullscreen = useCallback(() => {
    const el = toolCardRef.current;
    if (!el) return;
    try {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => void;
      };
      const fs = document.fullscreenElement ?? doc.webkitFullscreenElement;
      if (fs === el) {
        if (document.exitFullscreen) void document.exitFullscreen();
        else doc.webkitExitFullscreen?.();
      } else {
        const req =
          el.requestFullscreen?.bind(el) ??
          (
            el as unknown as { webkitRequestFullscreen?: () => void }
          ).webkitRequestFullscreen?.bind(el);
        void req?.();
      }
    } catch {
      setIsFullscreen(false);
    }
  }, []);

  const ringOffset = RING_C * (1 - Math.min(1, Math.max(0, progress)));

  const scrollToTool = () => {
    document
      .getElementById("pomodoro-tool")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    start();
  };

  const scrollToToolAndCustomize = useCallback(() => {
    document
      .getElementById("pomodoro-tool")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setIsCustomizing(true);
  }, []);

  const applyCustomization = useCallback(() => {
    const f = clampInt(draftFocus, 1, 90);
    const sh = clampInt(draftShort, 1, 30);
    const lo = clampInt(draftLong, 5, 60);
    const c = clampInt(draftCycles, 2, 8);
    setDraftFocus(f);
    setDraftShort(sh);
    setDraftLong(lo);
    setDraftCycles(c);
    setFocusMin(f);
    setShortMin(sh);
    setLongMin(lo);
    setCyclesTotal(c);
    writePomodoroPrefsToStorage({
      focusDuration: f,
      shortBreakDuration: sh,
      longBreakDuration: lo,
      cycles: c,
    });
    setConfigApplied(true);
    window.setTimeout(() => setConfigApplied(false), 2500);
  }, [draftFocus, draftShort, draftLong, draftCycles]);

  type PomoVisualPhase = "idle" | "focus" | "short_break" | "long_break";
  const isSessionPaused = isPausedLook;
  const pomoPhase: PomoVisualPhase =
    currentState === "idle" || currentState === "finished"
      ? "idle"
      : segment === "focus"
        ? "focus"
        : segment === "short_break"
          ? "short_break"
          : "long_break";
  const NextStateIcon = getNextStateIcon(pomoPhase);

  const cycleDotStates = Array.from(
    { length: totalCycleCount },
    (_, i) => {
      const n = i + 1;
      if (currentState === "idle" || currentState === "finished") {
        return "inactive" as const;
      }
      if (n < currentCycle) return "completed" as const;
      if (n === currentCycle) return "active" as const;
      return "inactive" as const;
    },
  );

  const sessionLabel = (() => {
    if (isSessionPaused) {
      if (segment === "focus") return "Foco pausado";
      if (segment === "short_break") return "Pausa curta pausada";
      return "Pausa longa pausada";
    }
    if (currentState === "idle") {
      return "Aguardando Início";
    }
    if (running) {
      if (segment === "focus") return "Foco";
      if (segment === "short_break") return "Pausa curta";
      return "Pausa longa";
    }
    if (segment === "focus") return "Iniciar foco";
    if (segment === "short_break") return "Iniciar pausa curta";
    return "Iniciar pausa longa";
  })();

  const badgeStateClass = cn(
    pomoPhase === "idle"
      ? "bg-blue-100 text-blue-700"
      : pomoPhase === "focus"
        ? "bg-green-100 text-green-700"
        : pomoPhase === "short_break"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700",
    isSessionPaused && "opacity-80",
  );
  const nextCellText =
    currentState === "idle" || currentState === "finished"
      ? "Próximo: Foco"
      : segment === "focus" && currentCycle < totalCycleCount
        ? "Próximo: Pausa curta"
        : segment === "focus" && currentCycle >= totalCycleCount
          ? "Próximo: Pausa longa"
          : "Próximo: Foco";
  const durationLabel =
    segment === "focus"
      ? `${focusMin} min`
      : segment === "short_break"
        ? `${shortMin} min`
        : `${longMin} min`;
  const cycleDisplay =
    segment === "long_break"
      ? `${totalCycleCount} / ${totalCycleCount}`
      : `${currentCycle} / ${totalCycleCount}`;
  const subline =
    segment === "focus"
      ? "Tempo para focar"
      : segment === "short_break"
        ? "Tempo para pausa curta"
        : "Tempo para pausa longa";
  const ringStroke =
    segment === "focus"
      ? RING_COLOR_FOCUS
      : segment === "short_break"
        ? RING_COLOR_SHORT
        : RING_COLOR_LONG;

  const customizeFieldRow = (
    label: string,
    value: number,
    set: (n: number) => void,
    min: number,
    max: number,
    unitSuffix: string,
  ) => (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
      <span
        className="min-w-0 text-xs font-semibold whitespace-nowrap sm:text-sm"
        style={{ color: TEXT }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white transition hover:bg-[#F8FAFC]"
          style={{ borderColor: BORDER, color: TEXT_SEC }}
          onClick={() => set(Math.max(min, value - 1))}
          aria-label={`Diminuir ${label}`}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          inputMode="numeric"
          className="h-8 w-12 min-w-12 max-w-12 shrink-0 rounded-lg border bg-white text-center text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-200"
          style={{ borderColor: BORDER, color: TEXT }}
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (Number.isNaN(v)) return;
            set(clampInt(v, min, max));
          }}
          aria-label={`${label} — valor em ${unitSuffix || "unidades"}`}
        />
        <span
          className="inline-flex w-5 min-w-5 shrink-0 select-none items-center text-xs font-medium leading-none tabular-nums"
          style={{ color: TEXT_SEC }}
        >
          {unitSuffix ? (
            unitSuffix
          ) : (
            <span className="invisible" aria-hidden>
              min
            </span>
          )}
        </span>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-white transition hover:bg-[#F8FAFC]"
          style={{ borderColor: BORDER, color: TEXT_SEC }}
          onClick={() => set(Math.min(max, value + 1))}
          aria-label={`Aumentar ${label}`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="pomodoro-page min-w-0"
      style={{ backgroundColor: POMODORO_PAGE_WRAPPER_BG, color: TEXT }}
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-4">
        <AdBanner slot="top" />

        {/* Hero */}
        <section className="grid grid-cols-1 gap-8 py-6 lg:py-8 items-start lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="flex min-w-0 flex-col">
            <p
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/50 px-3.5 py-2 leading-none"
              style={{ backgroundColor: BADGE_BLUE_BG }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: GREEN }}
                aria-hidden
              />
              <span
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: BLUE }}
              >
                Técnica Pomodoro
              </span>
            </p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              <span className="block" style={{ color: TEXT }}>
                Pomodoro online:
              </span>
              <span className="mt-1 block" style={{ color: BLUE }}>
                mais foco, menos distrações
              </span>
            </h1>
            <p
              className="mt-4 max-w-xl text-base leading-relaxed"
              style={{ color: TEXT_SEC }}
            >
              A Técnica Pomodoro ajuda você a manter o foco em blocos de tempo,
              com pausas estratégicas para aumentar sua produtividade e
              bem-estar.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Aumente seu foco e produtividade",
                "Pausas no momento certo",
                "Melhore seu desempenho mental",
                "100% online, gratuito e sem cadastro",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm leading-relaxed md:text-base"
                  style={{ color: TEXT }}
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: BLUE }}
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToTool}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: BLUE }}
              >
                <Play
                  className="h-4 w-4 shrink-0 fill-white"
                  strokeWidth={0}
                  aria-hidden
                />
                Iniciar Pomodoro
              </button>
              <button
                type="button"
                onClick={scrollToToolAndCustomize}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-[#F8FAFC]"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                <Target
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                Personalizar
              </button>
            </div>
          </div>

          <div
            id="pomodoro-tool"
            className="mx-auto flex w-full min-w-0 justify-center lg:mx-0 lg:justify-end lg:justify-self-end"
          >
            <div className="w-full max-w-[480px] lg:max-w-[520px]">
              <div ref={toolCardRef} className="pomodoro-tool-card-fs-root w-full">
                <div
                  onPointerDown={onToolPointerDown}
                  className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -8px rgba(15,23,42,0.1)",
                  }}
                >
                <div className="relative flex min-h-8 items-center justify-start pr-24 sm:min-h-9 sm:pr-28">
                  <span
                    className={cn(
                      "inline-flex w-fit min-w-0 max-w-[calc(100%-6.25rem)] items-center truncate rounded-full px-4 py-1.5 text-base font-semibold transition-all duration-300",
                      badgeStateClass,
                    )}
                    title={sessionLabel}
                  >
                    {sessionLabel}
                  </span>
                  <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={toggleCardFullscreen}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={
                        isFullscreen ? "Sair da tela cheia" : "Tela cheia"
                      }
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <Maximize2 className="h-4 w-4" strokeWidth={2} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCustomizing((o) => !o)}
                      className={cn(
                        "rounded-lg border border-transparent p-2 text-slate-400 transition hover:border-slate-200/80 hover:bg-slate-100 hover:text-slate-600",
                        isCustomizing &&
                          "border-slate-200/80 bg-slate-100/90 text-slate-600",
                      )}
                      title="Personalizar sessão"
                      aria-label="Personalizar sessão"
                      aria-expanded={isCustomizing}
                      aria-controls="pomodoro-customize-panel"
                      id="pomodoro-customize-trigger"
                    >
                      <span
                        className="block text-[0.95rem] leading-none"
                        aria-hidden
                      >
                        ⚙
                      </span>
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "relative mx-auto mt-6 flex h-[280px] w-[280px] max-w-full origin-center items-center justify-center sm:mt-6",
                    isFullscreen &&
                      "scale-110 sm:scale-[1.15] motion-safe:transition-transform",
                  )}
                >
                  <svg
                    className="absolute inset-0 -rotate-90"
                    width={RING_SVG}
                    height={RING_SVG}
                    viewBox={`0 0 ${RING_SVG} ${RING_SVG}`}
                    aria-hidden
                  >
                    <circle
                      cx={RING_CX}
                      cy={RING_CY}
                      r={RING}
                      fill="none"
                      stroke={RING_TRACK}
                      strokeWidth={RING_STROKE}
                    />
                    <circle
                      cx={RING_CX}
                      cy={RING_CY}
                      r={RING}
                      fill="none"
                      stroke={ringStroke}
                      strokeWidth={RING_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={RING_C}
                      strokeDashoffset={ringOffset}
                      className={cn(
                        isSessionPaused
                          ? "transition-none"
                          : "transition-[stroke-dashoffset] duration-1000 ease-linear",
                      )}
                    />
                  </svg>
                  <div
                    className={cn(
                      "relative z-10 max-w-[88%] px-1 text-center",
                      isSessionPaused && "opacity-70",
                    )}
                  >
                    <p
                      className="text-[3.15rem] font-extrabold leading-[0.95] tabular-nums tracking-tight sm:text-[3.4rem] md:text-[3.55rem]"
                      style={{ color: TOOL_TIME_COLOR }}
                    >
                      {formatTimeSecs(timeRemaining)}
                    </p>
                    <p
                      className="mt-2 flex items-center justify-center gap-1.5 text-sm font-normal text-[#718096]"
                    >
                      {segment === "focus" ? (
                        <Target
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : (
                        <Coffee
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          aria-hidden
                        />
                      )}
                      {subline}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-stretch justify-center gap-3 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => (running ? pausePomodoro() : start())}
                    className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-600 hover:opacity-[0.98] sm:min-h-11 sm:min-w-[8.5rem] sm:px-5 sm:py-3"
                  >
                    {running ? (
                      <>
                        <Pause
                          className="h-4 w-4 shrink-0"
                          strokeWidth={2}
                          fill="currentColor"
                          aria-hidden
                        />
                        Pausar
                      </>
                    ) : isSessionPaused ? (
                      <>
                        <Play
                          className="h-4 w-4 shrink-0 fill-white"
                          strokeWidth={0}
                          aria-hidden
                        />
                        Continuar
                      </>
                    ) : (
                      <>
                        <Play
                          className="h-4 w-4 shrink-0 fill-white"
                          strokeWidth={0}
                          aria-hidden
                        />
                        Iniciar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:min-h-11 sm:min-w-[8.5rem] sm:px-5 sm:py-3"
                  >
                    <RotateCcw
                      className="h-4 w-4 shrink-0"
                      strokeWidth={2}
                      aria-hidden
                    />
                    Resetar
                  </button>
                </div>

                <div
                  className={cn(
                    "grid min-h-0 transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    isCustomizing ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      id="pomodoro-customize-panel"
                      role="region"
                      aria-labelledby="pomodoro-customize-trigger"
                      className="mt-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3 py-3 sm:px-4 sm:py-4"
                    >
                      <p
                        className="text-xs font-medium sm:text-sm"
                        style={{ color: TEXT_SEC }}
                      >
                        Ajuste os tempos e ciclos. A alteração entra em vigor ao
                        aplicar.
                      </p>
                      <div className="mt-3 flex min-w-0 flex-col gap-4 sm:mt-4">
                        {customizeFieldRow(
                          "Tempo de foco",
                          draftFocus,
                          setDraftFocus,
                          1,
                          90,
                          "min",
                        )}
                        {customizeFieldRow(
                          "Pausa curta",
                          draftShort,
                          setDraftShort,
                          1,
                          30,
                          "min",
                        )}
                        {customizeFieldRow(
                          "Pausa longa",
                          draftLong,
                          setDraftLong,
                          5,
                          60,
                          "min",
                        )}
                        {customizeFieldRow(
                          "Ciclos",
                          draftCycles,
                          setDraftCycles,
                          2,
                          8,
                          "",
                        )}
                      </div>
                      {configApplied ? (
                        <p
                          className="mt-2 text-center text-xs font-medium text-emerald-600"
                          role="status"
                        >
                          Configuração aplicada
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={applyCustomization}
                        className="mt-6 w-full rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-semibold transition hover:bg-blue-100/80"
                        style={{ color: BLUE }}
                      >
                        Aplicar configuração
                      </button>
                    </div>
                  </div>
                </div>

                <div className="-mx-6 -mb-6 mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-b-3xl border-t border-slate-200/90 bg-slate-200/80 sm:-mx-8 sm:-mb-8 sm:mt-6 sm:grid-cols-4">
                  <div
                    className="flex flex-col items-center bg-[#F8FAFC] px-3 py-4 text-center"
                  >
                    <RefreshCw
                      className="mx-auto h-4 w-4 text-slate-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                      Ciclo
                    </span>
                    <span
                      className="mt-0.5 text-sm font-semibold tabular-nums text-slate-800"
                    >
                      {cycleDisplay}
                    </span>
                    <div
                      className="mt-1.5 flex justify-center gap-1"
                      aria-hidden
                    >
                      {cycleDotStates.map((state, i) => {
                        const base =
                          "h-1.5 w-1.5 rounded-full transition-transform transition-colors duration-300";
                        if (state === "inactive") {
                          return (
                            <span
                              key={i}
                              className={cn(
                                base,
                                "scale-100 bg-slate-200/90 opacity-50",
                              )}
                            />
                          );
                        }
                        if (state === "completed") {
                          return (
                            <span
                              key={i}
                              className={cn(base, "scale-100 bg-sky-600")}
                            />
                          );
                        }
                        const activePhaseClass =
                          pomoPhase === "focus"
                            ? "bg-emerald-500"
                            : pomoPhase === "short_break"
                              ? "bg-amber-500"
                              : pomoPhase === "long_break"
                                ? "bg-rose-600"
                                : "bg-sky-600";
                        return (
                          <span
                            key={i}
                            className={cn(
                              base,
                              "scale-110",
                              !isSessionPaused && "animate-pulse",
                              activePhaseClass,
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-[#F8FAFC] px-3 py-4 text-center">
                    <Target
                      className="mx-auto h-4 w-4 text-slate-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                      Sessão
                    </span>
                    <span className="mt-0.5 text-sm font-semibold text-slate-800">
                      {sessionLabel}
                    </span>
                  </div>
                  <div className="flex flex-col items-center bg-[#F8FAFC] px-3 py-4 text-center">
                    <NextStateIcon
                      className="mx-auto h-4 w-4 text-slate-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                      Próximo
                    </span>
                    <span className="mt-0.5 text-sm font-semibold leading-tight text-slate-800">
                      {nextCellText}
                    </span>
                  </div>
                  <div className="flex flex-col items-center bg-[#F8FAFC] px-3 py-4 text-center">
                    <Clock
                      className="mx-auto h-4 w-4 text-slate-500"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="mt-1.5 text-[11px] font-medium text-slate-500">
                      Duração
                    </span>
                    <span className="mt-0.5 text-sm font-semibold text-slate-800">
                      {durationLabel}
                    </span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdBanner slot="middle" />
      </div>

      {/* Como funciona */}
      <section className="py-12" style={{ backgroundColor: PAGE_BG }}>
        <div className="mx-auto max-w-6xl px-4 lg:px-4">
          <div
            className="rounded-3xl border p-8"
            style={{ borderColor: BORDER, backgroundColor: SECTION_SOFT }}
          >
            <header className="max-w-2xl text-left">
              <h2
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ color: TEXT }}
              >
                Como funciona a Técnica Pomodoro?
              </h2>
              <p
                className="mt-4 text-base leading-relaxed md:text-lg"
                style={{ color: TEXT_SEC }}
              >
                Um método simples e eficaz para gerenciar seu tempo e aumentar
                sua produtividade.
              </p>
            </header>

            <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
              {(
                [
                  {
                    title: "Foco",
                    desc: "Trabalhe com foco total por 25 minutos",
                    Icon: Target,
                    circle: { bg: "#DCFCE7", color: "#16A34A" },
                  },
                  {
                    title: "Pausa curta",
                    desc: "Descanse por 5 minutos",
                    Icon: Coffee,
                    circle: { bg: "#FEF3C7", color: "#D97706" },
                  },
                  {
                    title: "Repita o ciclo",
                    desc: "Repita foco + pausa curta por 3 vezes",
                    Icon: RefreshCw,
                    circle: { bg: "#DBEAFE", color: "#2563EB" },
                  },
                  {
                    title: "Pausa Longa",
                    desc: "No 4º ciclo, após o foco, finalize com uma pausa maior de 15 a 30 minutos",
                    Icon: Coffee,
                    circle: { bg: "#EDE9FE", color: "#7C3AED" },
                  },
                ] as const
              ).map((step, i) => {
                const Icon = step.Icon;
                return (
                  <Fragment key={step.title}>
                    {i > 0 ? (
                      <>
                        <span
                          className="hidden shrink-0 self-start pt-8 text-2xl font-light leading-none lg:block"
                          style={{ color: "#CBD5E1" }}
                          aria-hidden
                        >
                          →
                        </span>
                        <span
                          className="block py-1 text-xl font-light leading-none lg:hidden"
                          style={{ color: "#CBD5E1" }}
                          aria-hidden
                        >
                          ↓
                        </span>
                      </>
                    ) : null}
                    <div className="flex w-full max-w-[15rem] flex-col items-center text-center lg:min-w-0 lg:flex-1 lg:max-w-none">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: step.circle.bg }}
                      >
                        <Icon
                          className="h-7 w-7"
                          strokeWidth={2}
                          style={{ color: step.circle.color }}
                          aria-hidden
                        />
                      </div>
                      <p
                        className={cn(
                          "mt-5 w-full text-base font-bold md:text-lg",
                          i === 3
                            ? "max-w-[min(100%,15rem)] whitespace-nowrap text-center leading-tight"
                            : "max-w-[200px] text-balance",
                        )}
                        style={{ color: TEXT }}
                      >
                        {i + 1}. {step.title}
                      </p>
                      {i === 3 ? (
                        <p
                          className="mt-2 w-full min-w-0 max-w-[220px] text-center text-sm leading-relaxed md:text-base"
                          style={{ color: TEXT_SEC }}
                        >
                          No 4º ciclo, após o foco,
                          <br />
                          finalize com uma pausa
                          <br />
                          <span className="whitespace-nowrap">
                            maior de 15 a 30 minutos
                          </span>
                        </p>
                      ) : (
                        <p
                          className="mt-2 w-full max-w-[200px] text-balance text-sm leading-relaxed md:text-base"
                          style={{ color: TEXT_SEC }}
                        >
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 lg:px-4">
        {/* 3 cards */}
        <section className="grid grid-cols-1 gap-6 py-10 lg:grid-cols-2 lg:gap-8">
          <div
            className="rounded-3xl border p-6 shadow-sm sm:p-8"
            style={{
              borderColor: CARD_BENEFITS_BORDER,
              backgroundColor: CARD_BENEFITS_BG,
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: GREEN }}
                aria-hidden
              >
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </span>
              <h3
                className="min-w-0 text-xl font-bold leading-snug"
                style={{ color: TEXT }}
              >
                Benefícios da Técnica Pomodoro
              </h3>
            </div>
            <ul className="mt-6 w-full max-w-full space-y-3">
              {[
                "Melhora o foco e concentração",
                "Reduz a procrastinação",
                "Aumenta a produtividade",
                "Evita o esgotamento mental",
                "Ajuda a manter uma rotina saudável",
              ].map((t) => (
                <li
                  key={t}
                  className="flex gap-3 text-sm leading-relaxed text-pretty md:text-[15px]"
                  style={{ color: TEXT_SEC }}
                >
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: GREEN }}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  <span className="min-w-0">{t}</span>
                </li>
              ))}
            </ul>
            <div
              className="mt-5 flex w-full items-end justify-center sm:mt-6"
              aria-hidden
            >
              <Image
                src="/images/estudante.png"
                alt=""
                width={577}
                height={433}
                className="h-auto w-full max-w-[min(100%,24rem)] object-contain object-bottom max-h-32 sm:max-h-40 md:max-h-44"
                quality={90}
                sizes="(max-width: 1024px) min(100vw, 24rem), 20rem"
              />
            </div>
          </div>

          <div
            className="rounded-3xl border p-8 shadow-sm"
            style={{
              borderColor: CARD_TIPS_BORDER,
              backgroundColor: CARD_TIPS_BG,
            }}
          >
            <div className="flex items-start gap-3">
              <Lightbulb
                className="mt-0.5 h-7 w-7 shrink-0"
                strokeWidth={2}
                style={{ color: "#CA8A04" }}
                aria-hidden
              />
              <h3
                className="text-xl font-bold leading-snug"
                style={{ color: TEXT }}
              >
                Dicas para melhores resultados
              </h3>
            </div>
            <ul className="mt-6 space-y-4">
              {(
                [
                  {
                    Icon: Target,
                    t: "Escolha uma tarefa importante para cada Pomodoro.",
                    color: "#DC2626",
                  },
                  {
                    Icon: Ban,
                    t: "Elimine distrações durante o período de foco.",
                    color: "#DC2626",
                  },
                  {
                    Icon: Coffee,
                    t: "Use as pausas para descansar de verdade.",
                    color: "#CA8A04",
                  },
                  {
                    Icon: Calendar,
                    t: "Seja consistente e crie o hábito.",
                    color: "#2563EB",
                  },
                  {
                    Icon: Settings2,
                    t: "Ajuste os tempos conforme sua necessidade.",
                    color: "#64748B",
                  },
                ] as const
              ).map(({ Icon, t, color }) => (
                <li
                  key={t}
                  className="flex gap-3 text-sm leading-relaxed md:text-[15px]"
                  style={{ color: TEXT_SEC }}
                >
                  <Icon
                    className="mt-0.5 h-5 w-5 shrink-0"
                    strokeWidth={2}
                    style={{ color }}
                    aria-hidden
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PomodoroGuiaSection />

        {/* Ciência */}
        <section className="py-8">
          <div
            className="flex flex-col items-stretch gap-6 rounded-3xl border p-8 md:flex-row md:items-center"
            style={{ borderColor: BORDER, backgroundColor: PAGE_BG }}
          >
            <span
              className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full md:mx-0"
              style={{ backgroundColor: "#DCFCE7", color: "#166534" }}
              aria-hidden
            >
              <Brain className="h-8 w-8" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1 space-y-1 text-center md:text-left">
              <h2
                className="text-lg font-bold md:text-xl"
                style={{ color: TEXT }}
              >
                Baseado na ciência
              </h2>
              <p
                className="text-sm leading-relaxed md:text-base"
                style={{ color: TEXT_SEC }}
              >
                A Técnica Pomodoro foi desenvolvida por Francesco Cirillo no
                final dos anos 1980 e é baseada em princípios de gestão do tempo
                e psicologia cognitiva para maximizar a produtividade.
              </p>
            </div>
            <a
              href="https://francescocirillo.com/pages/pomodoro-technique"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-xl border bg-white px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-[#F9FAFB] md:ml-auto"
              style={{ borderColor: BORDER, color: BLUE }}
            >
              Saiba mais
              <ExternalLink
                className="h-4 w-4 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
            </a>
          </div>
        </section>

        {/* Mais ferramentas */}
        <section className="py-10">
          <h2
            className="text-center text-3xl font-bold md:text-4xl"
            style={{ color: TEXT }}
          >
            Mais ferramentas para você
          </h2>
          <p
            className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed"
            style={{ color: TEXT_SEC }}
          >
            Tudo que você precisa para organizar seu tempo e sua rotina.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                {
                  href: "/" as const,
                  title: "Relógio",
                  desc: "Veja a hora certa e a data atualizada.",
                  Icon: Clock,
                  iconColor: "#2563EB",
                },
                {
                  href: "/despertador" as const,
                  title: "Despertador",
                  desc: "Crie alarmes personalizados e nunca mais se atrase.",
                  Icon: AlarmClock,
                  iconColor: "#EA580C",
                },
                {
                  href: "/cronometro" as const,
                  title: "Cronômetro",
                  desc: "Meça o tempo com precisão e registre voltas.",
                  Icon: Timer,
                  iconColor: "#7C3AED",
                },
                {
                  href: "/temporizador" as const,
                  title: "Temporizador",
                  desc: "Defina contagens regressivas para suas atividades.",
                  Icon: Hourglass,
                  iconColor: "#2563EB",
                },
                {
                  href: "/hora-mundial" as const,
                  title: "Hora Mundial",
                  desc: "Veja a hora atual em qualquer lugar do mundo.",
                  Icon: Globe,
                  iconColor: "#16A34A",
                },
              ] as const
            ).map((t) => (
              <article
                key={t.href}
                className="flex h-full flex-col rounded-2xl border bg-white p-6 md:p-8"
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center gap-2.5">
                  <t.Icon
                    className="h-5 w-5 shrink-0"
                    strokeWidth={2}
                    style={{ color: t.iconColor }}
                    aria-hidden
                  />
                  <h3
                    className="text-base font-bold leading-tight"
                    style={{ color: TEXT }}
                  >
                    {t.title}
                  </h3>
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: TEXT_SEC }}
                >
                  {t.desc}
                </p>
                <Link
                  href={t.href}
                  className="mt-auto pt-5 text-sm font-semibold transition hover:underline"
                  style={{ color: BLUE }}
                >
                  Usar ferramenta →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <AdBanner slot="bottom" />
      </div>

      {/* Footer tip */}
      <div
        className="border-t py-4"
        style={{ borderColor: BORDER, backgroundColor: `${BLUE}0d` }}
      >
        <div
          className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 text-center text-sm font-medium lg:px-4"
          style={{ color: BLUE }}
        >
          <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          Dica: Consistência é a chave. Comece com um Pomodoro e sinta a
          diferença!
        </div>
      </div>
    </div>
  );
}
