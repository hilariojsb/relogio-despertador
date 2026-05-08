"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BookOpen,
  ChevronDown,
  Clock,
  Globe2,
  MapPin,
  Moon,
  MousePointerClick,
  Plus,
  Search,
  Sun,
  Trash2,
} from "lucide-react";
import {
  ALL_WORLD_CITIES,
  DEFAULT_WORLD_CITIES,
  type WorldCity,
} from "@/lib/constants/world-cities";
import {
  formatFriendlyTimezoneSubtitle,
  formatLongDateInZone,
  formatShortDateInZone,
  getWallClockPartsInZone,
  isDaytimeInZone,
  offsetMinutesForTzAt,
  shortTzLabelAt,
} from "@/lib/accurate-world-time";
import { useSyncedUtcClock } from "@/hooks/useSyncedUtcClock";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hora_mundial_pins_v2";
const PRIMARY = "#3B82F6";
const BORDER = "#E2E8F0";
const CARD = "#FFFFFF";
const TEXT = "#0F172A";
const TEXT_MUTED = "#64748B";
const SHADOW =
  "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.06)";

type SortMode = "continent" | "name" | "time" | "custom";

function sortCities(
  list: WorldCity[],
  mode: SortMode,
  refUtcMs: number,
): WorldCity[] {
  if (mode === "custom") return [...list];
  const copy = [...list];
  if (mode === "name") {
    copy.sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
    );
    return copy;
  }
  if (mode === "time") {
    copy.sort(
      (a, b) =>
        offsetMinutesForTzAt(a.timezone, refUtcMs) -
        offsetMinutesForTzAt(b.timezone, refUtcMs),
    );
    return copy;
  }
  copy.sort((a, b) => {
    const ca = CONT_ORDER[getContinent(a.timezone)] ?? 99;
    const cb = CONT_ORDER[getContinent(b.timezone)] ?? 99;
    if (ca !== cb) return ca - cb;
    return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  });
  return copy;
}

function getContinent(tz: string): string {
  if (/^America\//.test(tz)) return "América";
  if (/^Europe\//.test(tz)) return "Europa";
  if (/^Africa\//.test(tz)) return "África";
  if (/^Asia\//.test(tz)) return "Ásia";
  if (/^Australia\//.test(tz) || /^Pacific\//.test(tz)) return "Oceania";
  return "Outros";
}

const CONT_ORDER: Record<string, number> = {
  América: 0,
  Europa: 1,
  África: 2,
  Ásia: 3,
  Oceania: 4,
  Outros: 5,
};

function prettifyLocalZone(tz: string): { line1: string; line2: string } {
  if (tz.includes("Sao_Paulo"))
    return { line1: "São Paulo", line2: "Brasil" };
  const tail = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
  return { line1: tail, line2: "Fuso do dispositivo" };
}

function cityByTz(tz: string): WorldCity {
  return (
    ALL_WORLD_CITIES.find((c) => c.timezone === tz) ?? {
      name: tz.split("/").pop()?.replace(/_/g, " ") ?? tz,
      timezone: tz,
      country: "",
      emoji: "🌍",
    }
  );
}

const POPULAR: { label: string; city: WorldCity }[] = [
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
  "America/Sao_Paulo",
  "America/Los_Angeles",
  "Asia/Shanghai",
].map((tz, i) => {
  const labels = [
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Dubai",
    "Sydney",
    "São Paulo",
    "Los Angeles",
    "Shanghai",
  ] as const;
  const base = cityByTz(tz);
  const label = labels[i];
  return { label, city: { ...base, name: label } };
});

const RELATED = [
  {
    href: "/pomodoro",
    title: "Pomodoro e blocos de foco",
    excerpt:
      "Ciclos de foco e pausas para estudar ou trabalhar com mais clareza.",
    icon: Clock,
  },
  {
    href: "/blog/despertador-estudar",
    title: "Despertador para estudar",
    excerpt:
      "Encaixe alarmes em blocos de leitura e revisão sem perder o ritmo.",
    icon: BookOpen,
  },
  {
    href: "/cronometro",
    title: "Cronômetro online",
    excerpt: "Meça treinos, tarefas e apresentações com precisão no navegador.",
    icon: Clock,
  },
  {
    href: "/temporizador",
    title: "Temporizador e lembretes",
    excerpt: "Contagens regressivas para cozinha, estudo e pausas curtas.",
    icon: Clock,
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "A hora mostrada é precisa?",
    a: "O instante UTC vem da TimeAPI.io (com fallback para World Time API) e a latência da rede é compensada. Cidade e fuso local usam ipapi.co quando disponível. Regras de fuso (IANA) vêm do navegador. Para uso crítico (aviação, contratos), confirme com fonte oficial.",
  },
  {
    q: "O horário de verão aparece automaticamente?",
    a: "Sim, quando o sistema operacional e o navegador estão atualizados com as regras do fuso. Mudanças de política em alguns países podem exigir atualização do dispositivo.",
  },
  {
    q: "Posso comparar várias cidades ao mesmo tempo?",
    a: "Sim. Adicione cidades à grelha, arraste para reordenar e use a busca para encontrar novos fusos. Os cartões atualizam em tempo real.",
  },
  {
    q: "Funciona no telemóvel?",
    a: "Sim. A página é responsiva: uma coluna em ecrã pequeno, duas em tablet e três em desktop, com a mesma precisão de tempo.",
  },
];

export function HoraMundialPageClient() {
  const { utcNowMs, timeSource, geo, worldTimeTz } = useSyncedUtcClock();
  const [pinned, setPinned] = useState<WorldCity[]>(() =>
    sortCities(DEFAULT_WORLD_CITIES, "continent", Date.now()),
  );
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("continent");
  const [sortOpen, setSortOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const userTz =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  const displayTz = geo?.timezone ?? worldTimeTz ?? userTz;

  const heroLocation = useMemo(() => {
    if (geo?.city && geo?.country) {
      return { line1: geo.city, line2: geo.country };
    }
    return prettifyLocalZone(displayTz);
  }, [geo, displayTz]);

  const friendlyTzLine = useMemo(
    () => formatFriendlyTimezoneSubtitle(utcNowMs, displayTz),
    [utcNowMs, displayTz],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WorldCity[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPinned(parsed);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    setPinned(sortCities(DEFAULT_WORLD_CITIES, "continent", Date.now()));
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node))
        setSortOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const persist = useCallback((next: WorldCity[]) => {
    setPinned(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();
    return ALL_WORLD_CITIES.filter(
      (c) =>
        (c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)) &&
        !pinned.some((p) => p.timezone === c.timezone),
    ).slice(0, 12);
  }, [search, pinned]);

  const addCity = useCallback(
    (city: WorldCity) => {
      if (pinned.some((p) => p.timezone === city.timezone)) return;
      persist([...pinned, city]);
      setSearch("");
    },
    [pinned, persist],
  );

  const removeCity = useCallback(
    (tz: string) => {
      persist(pinned.filter((c) => c.timezone !== tz));
    },
    [pinned, persist],
  );

  const onDragStart = (tz: string) => setDragKey(tz);
  const onDragEnd = () => setDragKey(null);
  const onDropOn = (targetTz: string) => {
    if (!dragKey || dragKey === targetTz) return;
    const from = pinned.findIndex((c) => c.timezone === dragKey);
    const to = pinned.findIndex((c) => c.timezone === targetTz);
    if (from < 0 || to < 0) return;
    const next = [...pinned];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    persist(next);
    setSortMode("custom");
    setDragKey(null);
  };

  const focusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="w-full space-y-10 sm:space-y-12 md:space-y-14">
      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:-mt-14 xl:-mt-16">
          <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              color: PRIMARY,
            }}
          >
            Hora mundial
          </span>
          <h1
            className="mt-5 max-w-[520px] text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:mt-6 sm:text-4xl md:mt-7 md:text-[2.5rem] md:leading-[1.1] mb-6 sm:mb-7"
            style={{ color: TEXT }}
          >
            Relógio mundial
            <br />
            em <span style={{ color: PRIMARY }}>tempo real</span>
          </h1>
          <p
            className="max-w-[480px] text-[15px] font-normal leading-[1.7] sm:text-[16px] sm:leading-[1.65]"
            style={{ color: TEXT_MUTED }}
          >
            <span className="block">
              Compare fusos horários de cidades e países em uma única tela.
              Ideal para reuniões internacionais, equipes distribuídas e
              planejamento de viagens.
            </span>
            <span className="mt-3 block sm:mt-3.5">
              As horas são atualizadas automaticamente em tempo real, diretamente
              no seu navegador.
            </span>
          </p>
        </div>

        <div
          className="rounded-2xl border p-7 sm:p-8"
          style={{
            backgroundColor: CARD,
            borderColor: BORDER,
            boxShadow:
              "0 1px 3px rgba(15,23,42,0.06), 0 8px 28px -6px rgba(15,23,42,0.1)",
          }}
        >
          <div className="mb-4 flex items-start gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.12)" }}
            >
              <Clock
                className="h-6 w-6"
                style={{ color: "#22C55E" }}
                strokeWidth={2}
                aria-hidden
              />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: TEXT_MUTED }}
              >
                Sua hora local
              </p>
              <p
                className="mb-1 truncate text-lg font-semibold leading-snug"
                style={{ color: TEXT }}
              >
                {heroLocation.line1}, {heroLocation.line2}
              </p>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                {friendlyTzLine}
              </p>
            </div>
          </div>
          <p className="mb-3 leading-[1.1]" style={{ color: TEXT }} suppressHydrationWarning>
            <HoraMundialClockRow
              utcMs={utcNowMs}
              timeZone={displayTz}
              className="text-[52px] leading-[1.1] sm:text-[56px] md:text-[60px]"
            />
          </p>
          <p
            className="mb-2 text-sm capitalize leading-relaxed"
            style={{ color: TEXT_MUTED }}
            suppressHydrationWarning
          >
            {formatLongDateInZone(utcNowMs, displayTz)}
          </p>
          {timeSource !== "local" && (
            <p
              className="text-[12px] leading-relaxed sm:text-[13px]"
              style={{ color: TEXT_MUTED }}
            >
              Sincronizado com servidores de tempo em tempo real
            </p>
          )}
          {timeSource === "local" && (
            <p
              className="text-[12px] leading-relaxed sm:text-[13px]"
              style={{ color: TEXT_MUTED }}
            >
              Sem conexão com servidores — usando o relógio do dispositivo
            </p>
          )}
        </div>
      </section>

      {/* Busca e controlos */}
      <section id="busca-hora-mundial" className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
              style={{ color: TEXT_MUTED }}
              strokeWidth={2}
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cidade ou país..."
              autoComplete="off"
              className="min-h-[52px] w-full rounded-xl border py-3.5 pl-12 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500/25 sm:text-[15px]"
              style={{
                borderColor: BORDER,
                backgroundColor: CARD,
                color: TEXT,
                boxShadow: SHADOW,
              }}
            />
            {searchResults.length > 0 && (
              <ul
                className="absolute z-30 mt-2 max-h-[min(50vh,320px)] w-full overflow-auto rounded-xl border py-1 shadow-lg"
                style={{
                  backgroundColor: CARD,
                  borderColor: BORDER,
                  boxShadow:
                    "0 10px 40px -10px rgba(15,23,42,0.18)",
                }}
                role="listbox"
              >
                {searchResults.map((city) => (
                  <li key={city.timezone} role="option" aria-selected={false}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#F1F5F9]"
                      style={{ color: TEXT }}
                      onClick={() => addCity(city)}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden>{city.emoji}</span>
                        <span className="truncate font-medium">{city.name}</span>
                        <span
                          className="truncate text-xs"
                          style={{ color: TEXT_MUTED }}
                        >
                          {city.country}
                        </span>
                      </span>
                      <Plus
                        className="h-4 w-4 shrink-0"
                        style={{ color: PRIMARY }}
                        aria-hidden
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
            <div className="relative min-w-[200px]" ref={sortRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSortOpen((o) => !o);
                }}
                className="flex min-h-[52px] w-full items-center justify-between gap-2 rounded-xl border px-4 text-left text-sm font-medium transition-colors hover:bg-[#F1F5F9] sm:min-w-[220px]"
                style={{
                  borderColor: BORDER,
                  backgroundColor: CARD,
                  color: TEXT,
                  boxShadow: SHADOW,
                }}
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
              >
                <span>
                  Ordenar por:{" "}
                  {sortMode === "continent"
                    ? "Continente"
                    : sortMode === "name"
                      ? "Nome"
                      : sortMode === "time"
                        ? "Hora"
                        : "Personalizado"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    sortOpen && "rotate-180",
                  )}
                  style={{ color: TEXT_MUTED }}
                  aria-hidden
                />
              </button>
              {sortOpen && (
                <ul
                  className="absolute right-0 z-30 mt-2 w-full min-w-[220px] overflow-hidden rounded-xl border py-1 shadow-lg"
                  style={{
                    backgroundColor: CARD,
                    borderColor: BORDER,
                  }}
                  role="listbox"
                >
                  {(
                    [
                      ["continent", "Continente"],
                      ["name", "Nome (A–Z)"],
                      ["time", "Hora (GMT)"],
                    ] as const
                  ).map(([val, label]) => (
                    <li
                      key={val}
                      role="option"
                      aria-selected={sortMode === val}
                    >
                      <button
                        type="button"
                        className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#F1F5F9]"
                        style={{
                          color: TEXT,
                          fontWeight: sortMode === val ? 600 : 400,
                        }}
                        onClick={() => {
                          const next = sortCities(
                            pinned,
                            val,
                            utcNowMs,
                          );
                          persist(next);
                          setSortMode(val);
                          setSortOpen(false);
                        }}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={focusSearch}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              style={{ backgroundColor: PRIMARY, boxShadow: SHADOW }}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              Adicionar cidade
            </button>
          </div>
        </div>
      </section>

      {/* Grelha de cidades */}
      <section aria-label="Relógios por cidade">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pinned.map((city) => (
            <CityClockCard
              key={city.timezone}
              city={city}
              utcMs={utcNowMs}
              onRemove={() => removeCity(city.timezone)}
              onDragStart={() => onDragStart(city.timezone)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropOn(city.timezone)}
              isDragOver={dragKey !== null && dragKey !== city.timezone}
            />
          ))}
        </div>
      </section>

      {/* Três cartões informativos */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <div
          className="rounded-2xl border p-6 sm:p-7"
          style={{
            backgroundColor: "#ECFDF5",
            borderColor: "#BBF7D0",
            boxShadow: SHADOW,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-lg font-bold"
                style={{ color: TEXT }}
              >
                Como usar
              </h2>
              <ol
                className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                <li>
                  Use a busca para encontrar uma cidade e clique para
                  adicioná-la à grelha.
                </li>
                <li>
                  Arraste os cartões (ou use o indicador) para reordenar a
                  lista ao seu gosto.
                </li>
                <li>
                  Escolha a ordenação por continente, nome ou hora para
                  organizar muitos fusos de uma vez.
                </li>
              </ol>
            </div>
            <div
              className="hidden shrink-0 sm:flex sm:h-24 sm:w-24 sm:items-center sm:justify-center sm:rounded-2xl"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
            >
              <Globe2
                className="h-12 w-12"
                style={{ color: "#059669" }}
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border p-6 sm:p-7"
          style={{
            backgroundColor: "#EFF6FF",
            borderColor: "#BFDBFE",
            boxShadow: SHADOW,
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: TEXT }}>
            O que é um fuso horário?
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: TEXT_MUTED }}
          >
            Um fuso horário é uma faixa onde se usa o mesmo horário civil,
            definido em relação ao meridiano de referência (UTC). Países
            ajustam relógios para alinhar o dia solar à vida económica e podem
            aplicar horário de verão.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-flex text-sm font-semibold"
            style={{ color: PRIMARY }}
          >
            Saiba mais →
          </Link>
        </div>

        <div
          className="rounded-2xl border p-6 sm:p-7"
          style={{
            backgroundColor: "#FFFBEB",
            borderColor: "#FDE68A",
            boxShadow: SHADOW,
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: TEXT }}>
            Dicas rápidas
          </h2>
          <ul className="mt-4 space-y-3 text-sm" style={{ color: TEXT_MUTED }}>
            <li className="flex gap-2.5">
              <Search
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: PRIMARY }}
                aria-hidden
              />
              <span>Busque pelo nome da cidade ou do país em português.</span>
            </li>
            <li className="flex gap-2.5">
              <MousePointerClick
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: PRIMARY }}
                aria-hidden
              />
              <span>Toque num resultado para fixar o relógio na grelha.</span>
            </li>
            <li className="flex gap-2.5">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: PRIMARY }}
                aria-hidden
              />
              <span>
                O indicador sol/lua mostra se é provavelmente dia ou noite
                local.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Cidades populares */}
      <section aria-labelledby="cidades-populares-heading">
        <h2
          id="cidades-populares-heading"
          className="text-lg font-bold"
          style={{ color: TEXT }}
        >
          Cidades mais pesquisadas
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {POPULAR.map(({ label, city }) => (
            <button
              key={label}
              type="button"
              onClick={() => addCity(city)}
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-white"
              style={{
                borderColor: BORDER,
                backgroundColor: CARD,
                color: TEXT,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={focusSearch}
            className="text-sm font-semibold"
            style={{ color: PRIMARY }}
          >
            Ver todas →
          </button>
        </div>
      </section>

      {/* Conteúdos relacionados */}
      <section aria-labelledby="relacionados-heading">
        <h2
          id="relacionados-heading"
          className="text-lg font-bold"
          style={{ color: TEXT }}
        >
          Conteúdos relacionados
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED.map(({ href, title, excerpt, icon: Icon }) => (
            <article
              key={href}
              className="flex h-full flex-col rounded-2xl border p-5"
              style={{
                backgroundColor: CARD,
                borderColor: BORDER,
                boxShadow: SHADOW,
              }}
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              >
                <Icon className="h-5 w-5" style={{ color: PRIMARY }} aria-hidden />
              </span>
              <span
                className="mt-3 inline-block w-fit rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.12)",
                  color: PRIMARY,
                }}
              >
                Blog
              </span>
              <h3
                className="mt-2 text-base font-bold leading-snug"
                style={{ color: TEXT }}
              >
                {title}
              </h3>
              <p
                className="mt-2 flex-1 text-sm leading-relaxed"
                style={{ color: TEXT_MUTED }}
              >
                {excerpt}
              </p>
              <Link
                href={href}
                className="mt-4 inline-flex text-sm font-semibold"
                style={{ color: PRIMARY }}
              >
                Ler artigo →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ + sincronização */}
      <section
        className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10"
        aria-labelledby="faq-heading"
      >
        <div className="lg:col-span-2">
          <h2
            id="faq-heading"
            className="text-xl font-bold"
            style={{ color: TEXT }}
          >
            Perguntas frequentes
          </h2>
          <ul className="mt-6 space-y-2">
            {FAQ_ITEMS.map((item, i) => {
              const open = faqOpen === i;
              return (
                <li
                  key={item.q}
                  className="rounded-xl border"
                  style={{ borderColor: BORDER, backgroundColor: CARD }}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    onClick={() => setFaqOpen(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span
                      className="text-sm font-semibold sm:text-[15px]"
                      style={{ color: TEXT }}
                    >
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        open && "rotate-180",
                      )}
                      style={{ color: TEXT_MUTED }}
                      aria-hidden
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-200 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        className="border-t px-4 py-3 text-sm leading-relaxed"
                        style={{
                          borderColor: BORDER,
                          color: TEXT_MUTED,
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside>
          <div
            className="rounded-2xl border p-6 sm:p-7"
            style={{
              backgroundColor: CARD,
              borderColor: BORDER,
              boxShadow: SHADOW,
            }}
          >
            <div
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.08)" }}
            >
              <Clock
                className="h-14 w-14"
                style={{ color: PRIMARY }}
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
            <h3
              className="mt-5 text-center text-base font-bold"
              style={{ color: TEXT }}
            >
              Sincronização em tempo real
            </h3>
            <p
              className="mt-3 text-center text-sm leading-relaxed"
              style={{ color: TEXT_MUTED }}
            >
              TimeAPI.io (UTC) com fallback para World Time API; localização
              por ipapi.co. Correção de latência na sincronização; nova
              calibragem a cada minuto.
            </p>
          </div>
        </aside>
      </section>

      {/* Faixa de dica */}
      <div
        className="rounded-xl border px-4 py-3.5 text-center text-sm sm:px-6"
        style={{
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "#BFDBFE",
          color: TEXT,
        }}
      >
        <span className="font-semibold" style={{ color: PRIMARY }}>
          Dica:
        </span>{" "}
        Arraste os cartões de cidade para reordenar a lista na ordem que
        preferir. A ordem é guardada neste dispositivo.
      </div>
    </div>
  );
}

/**
 * Horário só para /hora-mundial: hierarquia HH:MM vs :ss estilizada por .world-clock-page em world-clock-page.css.
 */
function HoraMundialClockRow({
  utcMs,
  timeZone,
  className,
}: {
  utcMs: number;
  timeZone: string;
  className?: string;
}) {
  const { hour, minute, second } = getWallClockPartsInZone(utcMs, timeZone);
  return (
    <span
      className={cn(
        "clock-digit inline-flex max-w-full items-baseline whitespace-nowrap",
        className,
      )}
      suppressHydrationWarning
    >
      <span className="time-main font-bold">{hour}</span>
      <span className="time-separator-main font-bold" aria-hidden>
        :
      </span>
      <span className="time-main font-bold">{minute}</span>
      <span className="ml-[2px] inline-flex items-baseline">
        <span className="time-separator-seconds font-medium" aria-hidden>
          :
        </span>
        <span className="time-seconds">{second}</span>
      </span>
    </span>
  );
}

function CityClockCard({
  city,
  utcMs,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragOver,
}: {
  city: WorldCity;
  utcMs: number;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isDragOver: boolean;
}) {
  const t = utcMs;
  const day = isDaytimeInZone(t, city.timezone);
  const dateStr = formatShortDateInZone(t, city.timezone);
  const tzCode = shortTzLabelAt(t, city.timezone);

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={cn(
        "relative cursor-grab rounded-2xl border p-5 transition-[box-shadow,transform] active:cursor-grabbing",
        isDragOver && "ring-2 ring-blue-400/50",
      )}
      title="Arraste para reordenar"
      style={{
        backgroundColor: CARD,
        borderColor: BORDER,
        boxShadow: SHADOW,
      }}
    >
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 rounded-lg p-2 transition-colors hover:bg-[#F1F5F9]"
        style={{ color: TEXT_MUTED }}
        aria-label={`Remover ${city.name}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-start gap-3 pr-10">
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: day ? "#EAB308" : PRIMARY }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-bold"
            style={{ color: TEXT }}
          >
            {city.name}
          </h3>
          <p
            className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs sm:text-[13px]"
            style={{ color: TEXT_MUTED }}
          >
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span>{city.country}</span>
            <span aria-hidden>·</span>
            <span className="clock-digit text-[11px]">{tzCode}</span>
          </p>
        </div>
      </div>

      <p className="mt-5" style={{ color: TEXT }} suppressHydrationWarning>
        <HoraMundialClockRow
          utcMs={t}
          timeZone={city.timezone}
          className="text-3xl sm:text-[2rem]"
        />
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3" style={{ borderColor: BORDER }}>
        <span
          className="text-xs capitalize sm:text-sm"
          style={{ color: TEXT_MUTED }}
          suppressHydrationWarning
        >
          {dateStr}
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium sm:text-[13px]"
          style={{ color: TEXT_MUTED }}
        >
          {day ? (
            <Sun className="h-4 w-4 text-amber-500" aria-hidden />
          ) : (
            <Moon className="h-4 w-4 text-blue-500" aria-hidden />
          )}
          {day ? "Dia" : "Noite"}
        </span>
      </div>
    </article>
  );
}
