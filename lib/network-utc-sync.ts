/**
 * Sincronização de UTC com várias fontes (resiliência estilo time.is).
 * Principal: TimeAPI.io UTC. Fallback: World Time API /ip. Último recurso: Date.now().
 * Geolocalização (fuso, cidade, país): ipapi.co — pedido separado do tempo.
 */

import {
  IPAPI_GEO,
  TIMEAPI_IO_UTC,
  WORLDTIME_API_IP,
  type IpApiGeoResponse,
  type TimeApiIoZoneResponse,
  type WorldTimeApiIpResponse,
  parseUtcMsFromIso,
  parseUtcMsFromTimeApiDateTime,
} from "@/lib/accurate-world-time";

export type TimeSyncSource = "timeapi-io" | "worldtimeapi" | "local";

export type UtcAnchorResult = {
  correctedUtcMs: number;
  source: TimeSyncSource;
  /** Só quando o fallback World Time API for usado (timezone do IP na resposta). */
  worldTimeApiTz: string | null;
};

export type IpGeo = {
  timezone: string;
  city: string;
  /** Nome do país (ipapi `country_name`), para exibição. */
  country: string;
  /** ISO 3166-1 alpha-2 (ipapi `country`), ex. BR — para bandeira; null se inválido. */
  countryCode: string | null;
};

/**
 * Mede RTT com performance.now(), assume ida ≈ volta: correção +latency/2 no instante do servidor.
 */
export async function resolveUtcAnchor(): Promise<UtcAnchorResult> {
  const t0 = performance.now();
  try {
    const res = await fetch(TIMEAPI_IO_UTC, { cache: "no-store" });
    const t1 = performance.now();
    const latency = t1 - t0;
    if (!res.ok) throw new Error(`timeapi ${res.status}`);
    const data = (await res.json()) as TimeApiIoZoneResponse;
    const serverMs = parseUtcMsFromTimeApiDateTime(data.dateTime);
    if (!Number.isFinite(serverMs)) throw new Error("invalid dateTime");
    if (
      typeof data.timeZone === "string" &&
      data.timeZone.length > 0 &&
      !/utc/i.test(data.timeZone)
    ) {
      /* resposta atípica; ainda confiamos em dateTime como UTC conforme contrato da API */
    }
    const corrected = serverMs + latency / 2;
    return {
      correctedUtcMs: corrected,
      source: "timeapi-io",
      worldTimeApiTz: null,
    };
  } catch {
    /* fallback */
  }

  const t0b = performance.now();
  try {
    const res = await fetch(WORLDTIME_API_IP, { cache: "no-store" });
    const t1b = performance.now();
    const latency = t1b - t0b;
    if (!res.ok) throw new Error(`worldtimeapi ${res.status}`);
    const data = (await res.json()) as WorldTimeApiIpResponse;
    const serverMs = parseUtcMsFromIso(data.utc_datetime);
    if (!Number.isFinite(serverMs)) throw new Error("invalid utc_datetime");
    const corrected = serverMs + latency / 2;
    const worldTimeApiTz =
      typeof data.timezone === "string" && data.timezone.length > 0
        ? data.timezone
        : null;
    return {
      correctedUtcMs: corrected,
      source: "worldtimeapi",
      worldTimeApiTz,
    };
  } catch {
    return {
      correctedUtcMs: Date.now(),
      source: "local",
      worldTimeApiTz: null,
    };
  }
}

export async function fetchIpGeo(): Promise<IpGeo | null> {
  try {
    const res = await fetch(IPAPI_GEO, { cache: "no-store" });
    if (!res.ok) throw new Error(`ipapi ${res.status}`);
    const d = (await res.json()) as IpApiGeoResponse;
    const timezone =
      typeof d.timezone === "string" && d.timezone.length > 0
        ? d.timezone
        : null;
    if (!timezone) throw new Error("no timezone");
    const city = typeof d.city === "string" ? d.city : "";
    const raw =
      typeof d.country === "string" ? d.country.trim().toUpperCase() : "";
    const countryCode =
      raw.length === 2 && /^[A-Z]{2}$/.test(raw) ? raw : null;
    const country =
      typeof d.country_name === "string" && d.country_name.length > 0
        ? d.country_name
        : countryCode ?? "";
    return { timezone, city, country, countryCode };
  } catch {
    return null;
  }
}
