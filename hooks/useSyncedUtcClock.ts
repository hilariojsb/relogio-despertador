"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  fetchIpGeo,
  resolveUtcAnchor,
  type IpGeo,
  type TimeSyncSource,
} from "@/lib/network-utc-sync";

export type { IpGeo, TimeSyncSource } from "@/lib/network-utc-sync";

const TICK_MS = 1000;
const RESYNC_MS = 60_000;
const UTC_CACHE_KEY = "synced_utc_clock_cache_v1";
/** Evita usar cache muito velho se o separador ficou aberto horas. */
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function readCachedBootUtc(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(UTC_CACHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { utc: number; wall: number };
    if (typeof p.utc !== "number" || typeof p.wall !== "number") return null;
    const elapsed = Date.now() - p.wall;
    if (!Number.isFinite(elapsed) || elapsed < 0 || elapsed > CACHE_MAX_AGE_MS)
      return null;
    return p.utc + elapsed;
  } catch {
    return null;
  }
}

function writeUtcCache(utc: number) {
  try {
    localStorage.setItem(
      UTC_CACHE_KEY,
      JSON.stringify({ utc, wall: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

/**
 * Relógio UTC: resultado visível já no primeiro paint (Date.now / cache local);
 * TimeAPI.io → World Time API → local em background; geo em paralelo.
 * Âncora: serverMs + RTT/2; continuidade: base + (Date.now() - startWall).
 */
export function useSyncedUtcClock() {
  const [utcNowMs, setUtcNowMs] = useState(() => Date.now());
  const [timeSource, setTimeSource] = useState<TimeSyncSource>("local");
  const [geo, setGeo] = useState<IpGeo | null>(null);
  const [worldTimeTz, setWorldTimeTz] = useState<string | null>(null);

  const baseUtcRef = useRef(0);
  const startWallRef = useRef(0);

  const applyTimeAnchor = useCallback(
    (correctedUtcMs: number, src: TimeSyncSource) => {
      baseUtcRef.current = correctedUtcMs;
      startWallRef.current = Date.now();
      setUtcNowMs(correctedUtcMs);
      setTimeSource(src);
      if (src === "timeapi-io" || src === "worldtimeapi") {
        writeUtcCache(correctedUtcMs);
      }
    },
    [],
  );

  const syncTime = useCallback(async () => {
    const result = await resolveUtcAnchor();
    setWorldTimeTz(result.worldTimeApiTz);
    applyTimeAnchor(result.correctedUtcMs, result.source);
  }, [applyTimeAnchor]);

  const syncGeo = useCallback(async () => {
    const next = await fetchIpGeo();
    if (next) setGeo(next);
  }, []);

  const calibrate = useCallback(async () => {
    await Promise.all([syncTime(), syncGeo()]);
  }, [syncTime, syncGeo]);

  useLayoutEffect(() => {
    const wall = Date.now();
    const utc = readCachedBootUtc() ?? wall;
    baseUtcRef.current = utc;
    startWallRef.current = wall;
    setUtcNowMs(utc);
  }, []);

  useEffect(() => {
    void calibrate();
  }, [calibrate]);

  useEffect(() => {
    const tickId = window.setInterval(() => {
      setUtcNowMs(
        baseUtcRef.current + (Date.now() - startWallRef.current),
      );
    }, TICK_MS);
    return () => window.clearInterval(tickId);
  }, []);

  useEffect(() => {
    const resyncId = window.setInterval(() => {
      void calibrate();
    }, RESYNC_MS);
    return () => window.clearInterval(resyncId);
  }, [calibrate]);

  return {
    utcNowMs,
    timeSource,
    geo,
    worldTimeTz,
    isLoading: false,
  };
}
