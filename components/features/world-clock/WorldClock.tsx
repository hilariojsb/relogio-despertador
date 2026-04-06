'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { getDateInTimezone, getTimezoneOffset } from '@/lib/time-utils';
import { ALL_WORLD_CITIES, DEFAULT_WORLD_CITIES, type WorldCity } from '@/lib/constants/world-cities';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'timeos_world_cities';

function isDaytime(timezone: string): boolean {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat('en', { timeZone: timezone, hour: 'numeric', hour12: false }).format(new Date()),
      10
    );
    return hour >= 6 && hour < 20;
  } catch {
    return true;
  }
}

const CityCard = memo(function CityCard({
  city,
  timeStr,
  dateStr,
  dayTime,
  onRemove,
}: {
  city: WorldCity;
  timeStr: string;
  dateStr: string;
  dayTime: boolean;
  onRemove: (tz: string) => void;
}) {
  return (
    <article
      className="group relative rounded-2xl border border-border bg-card/80 p-5 transition-all animate-fade-in hover:border-border hover:bg-card"
    >
      <button
        type="button"
        onClick={() => onRemove(city.timezone)}
        className="absolute right-3 top-3 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-muted-foreground opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Remover ${city.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5 h-2 w-2 shrink-0 rounded-full',
            dayTime ? 'bg-amber-400' : 'bg-primary'
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <span className="text-base" aria-hidden>
              {city.emoji}
            </span>
            <p className="truncate text-sm font-medium text-foreground">{city.name}</p>
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            {city.country}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="clock-digit text-3xl font-bold tabular-nums text-foreground" suppressHydrationWarning>
          {timeStr}
        </p>
        <p className="mt-1 text-xs capitalize text-muted-foreground" suppressHydrationWarning>
          {dateStr}
        </p>
      </div>

      <p className="mt-3 text-xs text-muted-foreground/80">{dayTime ? 'Dia' : 'Noite'}</p>
    </article>
  );
});

export default function WorldClock() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [pinnedCities, setPinnedCities] = useState<WorldCity[]>(DEFAULT_WORLD_CITIES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPinnedCities(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const timezoneKeys = useMemo(() => {
    const set = new Set<string>();
    pinnedCities.forEach(c => set.add(c.timezone));
    ALL_WORLD_CITIES.forEach(c => set.add(c.timezone));
    return Array.from(set);
  }, [pinnedCities]);

  useEffect(() => {
    if (!mounted) return;
    function updateTimes() {
      const t: Record<string, string> = {};
      timezoneKeys.forEach(tz => {
        t[tz] = getTimezoneOffset(tz);
      });
      setTimes(t);
    }
    updateTimes();
    const interval = window.setInterval(updateTimes, 1000);
    return () => window.clearInterval(interval);
  }, [mounted, timezoneKeys]);

  const addCity = useCallback((city: WorldCity) => {
    setPinnedCities(prev => {
      if (prev.some(c => c.timezone === city.timezone)) return prev;
      const next = [...prev, city];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSearch('');
  }, []);

  const removeCity = useCallback((timezone: string) => {
    setPinnedCities(prev => {
      const next = prev.filter(c => c.timezone !== timezone);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_WORLD_CITIES.filter(
      c =>
        (c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)) &&
        !pinnedCities.some(p => p.timezone === c.timezone)
    );
  }, [search, pinnedCities]);

  if (!mounted) return null;

  return (
    <div className="w-full space-y-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cidade..."
          className="min-h-[48px] w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/45 focus:outline-none focus:ring-2 focus:ring-primary/20"
          autoComplete="off"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full z-20 mt-2 max-h-[min(50vh,320px)] w-full overflow-y-auto rounded-xl border border-border bg-card shadow-2xl animate-fade-in">
            {searchResults.slice(0, 8).map(city => (
              <button
                key={city.timezone}
                type="button"
                onClick={() => addCity(city)}
                className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span>{city.emoji}</span>
                  <span className="truncate">{city.name}</span>
                  <span className="truncate text-muted-foreground/70">{city.country}</span>
                </div>
                <Plus className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pinnedCities.map(city => {
          const timeStr = times[city.timezone] ?? '--:--:--';
          const dayTime = isDaytime(city.timezone);
          const dateStr = getDateInTimezone(city.timezone);

          return (
            <CityCard
              key={city.timezone}
              city={city}
              timeStr={timeStr}
              dateStr={dateStr}
              dayTime={dayTime}
              onRemove={removeCity}
            />
          );
        })}
      </div>
    </div>
  );
}
