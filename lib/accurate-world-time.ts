/** Tipos e helpers para relógio sincronizado (UTC) — preparado para vários fusos. */

/** Fonte principal de tempo (UTC). */
export const TIMEAPI_IO_UTC =
  "https://timeapi.io/api/Time/current/zone?timeZone=UTC" as const;

/** Fallback de tempo (IP → UTC + timezone do cliente na resposta). */
export const WORLDTIME_API_IP = "https://worldtimeapi.org/api/ip" as const;

/** Geolocalização por IP (fuso, cidade, país) — independente das APIs de tempo. */
export const IPAPI_GEO = "https://ipapi.co/json/" as const;

export type TimeApiIoZoneResponse = {
  dateTime: string;
  timeZone: string;
};

export type WorldTimeApiIpResponse = {
  utc_datetime: string;
  timezone: string;
};

export type IpApiGeoResponse = {
  timezone?: string | null;
  city?: string | null;
  country?: string | null;
  country_name?: string | null;
};

export function parseUtcMsFromIso(iso: string): number {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}

/** TimeAPI.io devolve ISO sem sufixo Z; força UTC. */
export function parseUtcMsFromTimeApiDateTime(dateTime: string): number {
  const s = dateTime.trim();
  const withZone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(s) ? s : `${s}Z`;
  const t = Date.parse(withZone);
  return Number.isFinite(t) ? t : NaN;
}

/** @deprecated use parseUtcMsFromIso */
export const parseUtcMsFromApi = parseUtcMsFromIso;

/** Hora HH:mm:ss (24h) num fuso, a partir de um instante UTC em ms. */
export function formatClockTimeInZone(utcMs: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(utcMs));
  } catch {
    return "--:--:--";
  }
}

/** Partes HH, MM, SS (2 dígitos) no fuso indicado, a partir de UTC em ms. */
export function getWallClockPartsInZone(
  utcMs: number,
  timeZone: string,
): { hour: string; minute: string; second: string } {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(new Date(utcMs));
    return {
      hour: parts.find((p) => p.type === "hour")?.value ?? "00",
      minute: parts.find((p) => p.type === "minute")?.value ?? "00",
      second: parts.find((p) => p.type === "second")?.value ?? "00",
    };
  } catch {
    return { hour: "--", minute: "--", second: "--" };
  }
}

/** Data curta estilo getDateInTimezone, a partir de UTC ms. */
export function formatShortDateInZone(utcMs: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(utcMs));
  } catch {
    return "";
  }
}

/** Data longa (hero). */
export function formatLongDateInZone(utcMs: number, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(utcMs));
  } catch {
    return "";
  }
}

export function shortTzLabelAt(utcMs: number, timeZone: string): string {
  try {
    const s = new Date(utcMs).toLocaleString("pt-BR", {
      timeZone,
      timeZoneName: "short",
    });
    const m = s.match(/GMT[+-]\d+|UTC[+-]\d+|[A-Z]{2,4}(?![a-z])/);
    if (m) return m[0];
    return timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone;
  } catch {
    return timeZone;
  }
}

/**
 * Linha legível para o card local, ex.: "UTC-3 • Horário de Brasília".
 * Evita IANA cru (America/Sao_Paulo).
 */
export function formatFriendlyTimezoneSubtitle(
  utcMs: number,
  timeZone: string,
): string {
  try {
    const d = new Date(utcMs);
    const offsetRaw = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value;

    const offsetLabel =
      offsetRaw != null
        ? offsetRaw.replace(/^GMT/i, "UTC").trim()
        : "";

    const longName = new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      timeZoneName: "long",
    })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")
      ?.value?.trim();

    if (offsetLabel && longName) return `${offsetLabel} • ${longName}`;
    if (longName) return longName;
    if (offsetLabel) return offsetLabel;
    return timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone;
  } catch {
    return timeZone.split("/").pop()?.replace(/_/g, " ") ?? timeZone;
  }
}

export function isDaytimeInZone(utcMs: number, timeZone: string): boolean {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en", {
        timeZone,
        hour: "numeric",
        hour12: false,
      }).format(new Date(utcMs)),
      10,
    );
    return hour >= 6 && hour < 20;
  } catch {
    return true;
  }
}

/** Offset aproximado em minutos para ordenação por “hora”. */
export function offsetMinutesForTzAt(timeZone: string, utcMs: number): number {
  try {
    const d = new Date(utcMs);
    const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
    const z = new Date(d.toLocaleString("en-US", { timeZone }));
    return (z.getTime() - utc.getTime()) / 60000;
  } catch {
    return 0;
  }
}
