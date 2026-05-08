"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GLOBAL_VOLUME_STORAGE_KEY } from "@/lib/alarm-types";
import { playAlarmSound } from "@/lib/time-utils";

const STORAGE_KEY = "pomodoro_state";
/** Migração one-shot a partir de snapshots antigos. */
const LEGACY_STORAGE_KEY = "pomodoro_state_v1";

export type PomodoroState =
  | "idle"
  | "focus"
  | "short_break"
  | "long_break"
  | "paused"
  | "finished";

export type WorkSegment = "focus" | "short_break" | "long_break";

/** Formato em localStorage (chave `pomodoro_state`). */
type PomodoroStorage = {
  state: PomodoroState;
  timeLeft: number;
  cycle: number;
  isRunning: boolean;
  isPaused: boolean;
  startedAt: number;
  focusBlocksCompleted: number;
  segment: WorkSegment;
  focusMin: number;
  shortMin: number;
  longMin: number;
  totalCycles: number;
  version: number;
};

const STORAGE_VERSION = 1;

const VALID_STATES: readonly PomodoroState[] = [
  "idle",
  "focus",
  "short_break",
  "long_break",
  "paused",
  "finished",
] as const;

const VALID_SEGMENTS: readonly WorkSegment[] = [
  "focus",
  "short_break",
  "long_break",
] as const;

function isPomodoroState(v: unknown): v is PomodoroState {
  return typeof v === "string" && (VALID_STATES as readonly string[]).includes(v);
}

function isWorkSegment(v: unknown): v is WorkSegment {
  return typeof v === "string" && (VALID_SEGMENTS as readonly string[]).includes(v);
}

function isFinitePositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 0;
}

type LegacyV1 = {
  currentState?: PomodoroState;
  timeRemaining?: number;
  currentCycle?: number;
  focusBlocksCompleted?: number;
  segment?: WorkSegment;
  isRunning?: boolean;
  isPaused?: boolean;
  focusMin?: number;
  shortMin?: number;
  longMin?: number;
  totalCycles?: number;
  savedAt?: number;
};

function tryMigrateLegacyV1(raw: string): PomodoroStorage | null {
  try {
    const p = JSON.parse(raw) as LegacyV1;
    if (typeof p.timeRemaining !== "number" || typeof p.savedAt !== "number")
      return null;
    if (!isPomodoroState(p.currentState) || p.currentState === "finished")
      return null;
    const seg: WorkSegment = isWorkSegment(p.segment) ? p.segment : "focus";
    return {
      state: p.currentState,
      timeLeft: Math.max(0, Math.floor(p.timeRemaining)),
      cycle: Math.max(1, Math.min(p.currentCycle ?? 1, p.totalCycles ?? 99)),
      isRunning: Boolean(p.isRunning),
      isPaused: Boolean(p.isPaused),
      startedAt: p.savedAt,
      focusBlocksCompleted: Math.max(
        0,
        Math.min(
          p.focusBlocksCompleted ?? 0,
          p.totalCycles ?? 4,
        ),
      ),
      segment: seg,
      focusMin: p.focusMin ?? 25,
      shortMin: p.shortMin ?? 5,
      longMin: p.longMin ?? 15,
      totalCycles: Math.max(1, p.totalCycles ?? 4),
      version: STORAGE_VERSION,
    };
  } catch {
    return null;
  }
}

function parsePomodoroStorage(raw: string | null): PomodoroStorage | null {
  if (raw == null) return null;
  try {
    const o = JSON.parse(raw) as unknown;
    if (typeof o !== "object" || o === null) return null;
    const p = o as Record<string, unknown>;
    if (p.version === STORAGE_VERSION) {
      if (!isPomodoroState(p.state) || p.state === "finished") return null;
      if (!isWorkSegment(p.segment)) return null;
      if (!isFinitePositiveInt(p.timeLeft)) return null;
      if (!isFinitePositiveInt(p.startedAt)) return null;
      if (typeof p.cycle !== "number" || !Number.isFinite(p.cycle)) return null;
      if (typeof p.isRunning !== "boolean") return null;
      if (typeof p.isPaused !== "boolean") return null;
      const totalCycles = Math.max(1, Math.floor(Number(p.totalCycles)) || 4);
      const cycle = Math.max(1, Math.min(Math.floor(p.cycle), totalCycles));
      if (typeof p.focusMin !== "number" || !Number.isFinite(p.focusMin))
        return null;
      if (typeof p.shortMin !== "number" || !Number.isFinite(p.shortMin))
        return null;
      if (typeof p.longMin !== "number" || !Number.isFinite(p.longMin))
        return null;
      if (typeof p.focusBlocksCompleted !== "number" || !Number.isFinite(p.focusBlocksCompleted))
        return null;
      return {
        state: p.state,
        timeLeft: Math.max(0, Math.floor(p.timeLeft)),
        cycle,
        isRunning: p.isRunning,
        isPaused: p.isPaused,
        startedAt: p.startedAt,
        focusBlocksCompleted: Math.max(0, Math.min(p.focusBlocksCompleted, totalCycles)),
        segment: p.segment,
        focusMin: p.focusMin,
        shortMin: p.shortMin,
        longMin: p.longMin,
        totalCycles,
        version: STORAGE_VERSION,
      };
    }
  } catch {
    /* */
  }
  return null;
}

function readStoredSnapshot(): PomodoroStorage | null {
  if (typeof window === "undefined") return null;
  try {
    const primary = localStorage.getItem(STORAGE_KEY);
    const parsed = parsePomodoroStorage(primary);
    if (parsed) return parsed;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const m = tryMigrateLegacyV1(legacy);
      if (m) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
          /* */
        }
        return m;
      }
    }
  } catch {
    /* */
  }
  return null;
}

function clearPomodoroStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* */
  }
}

function getAlarmVolume(): number {
  if (typeof window === "undefined") return 0.5;
  try {
    const raw = localStorage.getItem(GLOBAL_VOLUME_STORAGE_KEY);
    if (raw) {
      const n = parseFloat(raw);
      if (!Number.isNaN(n) && n >= 0 && n <= 1) return n;
    }
  } catch {
    /* */
  }
  return 0.5;
}

function toSeconds(mins: number) {
  return Math.max(1, Math.floor(mins * 60));
}

export function usePomodoro(
  focusMin: number,
  shortMin: number,
  longMin: number,
  totalCycles: number,
) {
  const focusSec = toSeconds(focusMin);
  const shortSec = toSeconds(shortMin);
  const longSec = toSeconds(longMin);
  const totalCyclesSafe = Math.max(1, totalCycles);

  const [currentState, setCurrentState] = useState<PomodoroState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(focusSec);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [focusBlocksCompleted, setFocusBlocksCompleted] = useState(0);
  const [segment, setSegment] = useState<WorkSegment>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopAlarmRef = useRef<(() => void) | null>(null);
  const segmentRef = useRef<WorkSegment>(segment);
  const currentCycleRef = useRef(currentCycle);

  useEffect(() => {
    segmentRef.current = segment;
  }, [segment]);
  useEffect(() => {
    currentCycleRef.current = currentCycle;
  }, [currentCycle]);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopAlarm = useCallback(() => {
    if (stopAlarmRef.current) {
      try {
        stopAlarmRef.current();
      } catch {
        /* */
      }
      stopAlarmRef.current = null;
    }
  }, []);

  const startAlarm = useCallback(() => {
    stopAlarm();
    const v = getAlarmVolume();
    if (v <= 0) return;
    stopAlarmRef.current = playAlarmSound(v);
  }, [stopAlarm]);

  const durationForSegment = useCallback(
    (s: WorkSegment) => {
      if (s === "focus") return focusSec;
      if (s === "short_break") return shortSec;
      return longSec;
    },
    [focusSec, shortSec, longSec],
  );

  const applyTransitionFrom = useCallback(
    (from: WorkSegment) => {
      const c = currentCycleRef.current;
      if (from === "focus") {
        setFocusBlocksCompleted((b) => Math.min(b + 1, totalCyclesSafe));
        if (c < totalCyclesSafe) {
          setSegment("short_break");
          setTimeRemaining(shortSec);
          setCurrentState("short_break");
        } else {
          setSegment("long_break");
          setTimeRemaining(longSec);
          setCurrentState("long_break");
        }
        return;
      }
      if (from === "short_break") {
        setCurrentCycle(c + 1);
        setSegment("focus");
        setTimeRemaining(focusSec);
        setCurrentState("focus");
        return;
      }
      if (from === "long_break") {
        setCurrentCycle(1);
        setFocusBlocksCompleted(0);
        setSegment("focus");
        setTimeRemaining(focusSec);
        setCurrentState("focus");
      }
    },
    [focusSec, longSec, shortSec, totalCyclesSafe],
  );

  const tick = useCallback(() => {
    setTimeRemaining((prev) => {
      if (prev <= 0) return 0;
      if (prev === 1) {
        clearTick();
        setIsRunning(false);
        const ended = segmentRef.current;
        setTimeout(() => {
          startAlarm();
          applyTransitionFrom(ended);
        }, 0);
        return 0;
      }
      return prev - 1;
    });
  }, [applyTransitionFrom, clearTick, startAlarm]);

  useEffect(() => {
    if (!isRunning) {
      clearTick();
      return;
    }
    tickRef.current = setInterval(tick, 1000);
    return () => {
      clearTick();
    };
  }, [isRunning, clearTick, tick]);

  // Restore from localStorage (`pomodoro_state` + migração de `pomodoro_state_v1`)
  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }
    const s = readStoredSnapshot();
    if (!s) {
      setHydrated(true);
      return;
    }
    try {
      const elapsed = Math.max(0, Math.floor((Date.now() - s.startedAt) / 1000));
      let t = Math.max(0, s.timeLeft);
      if (s.isRunning && s.state !== "paused" && s.state !== "idle" && s.state !== "finished") {
        t = Math.max(0, t - elapsed);
      }
      setSegment(s.segment);
      setCurrentCycle(Math.max(1, Math.min(s.cycle, s.totalCycles)));
      setFocusBlocksCompleted(
        Math.max(0, Math.min(s.focusBlocksCompleted, s.totalCycles)),
      );
      setCurrentState(s.state);
      setIsPaused(s.isPaused);

      if (t === 0 && s.isRunning && s.state !== "paused" && s.state !== "idle" && s.state !== "finished" && elapsed > 0) {
        setIsRunning(false);
        setIsPaused(false);
        const from = s.segment;
        if (from === "focus") {
          if (s.cycle < s.totalCycles) {
            setCurrentCycle(s.cycle);
            setSegment("short_break");
            setTimeRemaining(toSeconds(s.shortMin));
            setCurrentState("short_break");
            setFocusBlocksCompleted((b) => Math.min(b + 1, s.totalCycles));
          } else {
            setSegment("long_break");
            setTimeRemaining(toSeconds(s.longMin));
            setCurrentState("long_break");
            setFocusBlocksCompleted(s.totalCycles);
          }
        } else if (from === "short_break") {
          setCurrentCycle(s.cycle + 1);
          setSegment("focus");
          setTimeRemaining(toSeconds(s.focusMin));
          setCurrentState("focus");
        } else {
          setCurrentCycle(1);
          setFocusBlocksCompleted(0);
          setSegment("focus");
          setTimeRemaining(toSeconds(s.focusMin));
          setCurrentState("focus");
        }
      } else {
        setTimeRemaining(t);
        if (s.state === "paused") {
          setIsRunning(false);
        } else if (t > 0 && s.isRunning) {
          setIsRunning(true);
          setIsPaused(false);
        } else {
          setIsRunning(false);
        }
      }
    } catch {
      /* */
    }
    setHydrated(true);
  }, []);

  // Persist (snapshot + `startedAt` como ancoragem para o tempo em execução)
  useEffect(() => {
    if (!hydrated) return;
    if (typeof window === "undefined") return;
    try {
      const now = Date.now();
      const snap: PomodoroStorage = {
        state: currentState,
        timeLeft: timeRemaining,
        cycle: currentCycle,
        isRunning,
        isPaused,
        startedAt: now,
        focusBlocksCompleted,
        segment,
        focusMin,
        shortMin,
        longMin,
        totalCycles: totalCyclesSafe,
        version: STORAGE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {
      /* */
    }
  }, [
    hydrated,
    currentState,
    timeRemaining,
    currentCycle,
    focusBlocksCompleted,
    segment,
    isRunning,
    isPaused,
    focusMin,
    shortMin,
    longMin,
    totalCyclesSafe,
  ]);

  // Idle: sync time if focus length changes
  useEffect(() => {
    if (currentState !== "idle" || isRunning) return;
    setTimeRemaining(focusSec);
  }, [focusSec, currentState, isRunning]);

  // When the user applies new durations/cycles (props change), adjust without full reset
  useEffect(() => {
    if (!hydrated) return;
    if (currentState === "idle" && !isRunning) return;
    if (currentState === "finished") return;

    setCurrentCycle((c) => Math.min(c, totalCyclesSafe));
    setFocusBlocksCompleted((b) => Math.min(b, totalCyclesSafe));

    const workSeg: WorkSegment =
      currentState === "paused"
        ? segment
        : currentState === "focus" ||
            currentState === "short_break" ||
            currentState === "long_break"
          ? currentState
          : segment;
    const maxForSeg =
      workSeg === "focus"
        ? focusSec
        : workSeg === "short_break"
          ? shortSec
          : longSec;
    setTimeRemaining((t) => Math.min(t, maxForSeg));
  }, [
    hydrated,
    focusSec,
    shortSec,
    longSec,
    totalCyclesSafe,
    currentState,
    isRunning,
    segment,
  ]);

  const startPomodoro = useCallback(() => {
    stopAlarm();
    if (isRunning) return;
    if (currentState === "idle") {
      setCurrentCycle(1);
      setSegment("focus");
      setTimeRemaining(focusSec);
      setCurrentState("focus");
      setIsRunning(true);
      setIsPaused(false);
      return;
    }
    if (timeRemaining <= 0) {
      return;
    }
    if (currentState === "paused") {
      if (timeRemaining <= 0) return;
      setIsRunning(true);
      setIsPaused(false);
      setCurrentState(segment);
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  }, [
    isRunning,
    timeRemaining,
    currentState,
    focusSec,
    segment,
    stopAlarm,
  ]);

  const pausePomodoro = useCallback(() => {
    if (!isRunning) return;
    clearTick();
    setIsRunning(false);
    setIsPaused(true);
    setCurrentState("paused");
  }, [isRunning, clearTick]);

  const resetPomodoro = useCallback(() => {
    clearPomodoroStorage();
    stopAlarm();
    clearTick();
    setIsRunning(false);
    setIsPaused(false);
    setCurrentState("idle");
    setCurrentCycle(1);
    setFocusBlocksCompleted(0);
    setSegment("focus");
    setTimeRemaining(focusSec);
  }, [stopAlarm, clearTick, focusSec]);

  const onToolPointerDown = useCallback(() => {
    if (stopAlarmRef.current) {
      stopAlarm();
    }
  }, [stopAlarm]);

  const phaseTotalSeconds = useMemo(() => {
    if (currentState === "idle" || currentState === "finished")
      return focusSec;
    if (currentState === "paused") return durationForSegment(segment);
    if (
      currentState === "focus" ||
      currentState === "short_break" ||
      currentState === "long_break"
    ) {
      return durationForSegment(currentState);
    }
    return focusSec;
  }, [currentState, segment, focusSec, durationForSegment]);

  const progress = useMemo(() => {
    if (phaseTotalSeconds <= 0) return 0;
    return 1 - timeRemaining / phaseTotalSeconds;
  }, [timeRemaining, phaseTotalSeconds]);

  const displaySegment: WorkSegment = useMemo(() => {
    if (currentState === "idle" || currentState === "finished")
      return "focus";
    if (currentState === "paused") return segment;
    if (
      currentState === "focus" ||
      currentState === "short_break" ||
      currentState === "long_break"
    ) {
      return currentState;
    }
    return "focus";
  }, [currentState, segment]);

  return {
    currentState,
    timeRemaining,
    currentCycle,
    totalCycles: totalCyclesSafe,
    isRunning,
    isPaused,
    segment: displaySegment,
    focusBlocksCompleted,
    progress,
    phaseTotalSeconds,
    isPausedLook: currentState === "paused",
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    onToolPointerDown,
  };
}
