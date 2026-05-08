/** Quantidade de cards na seção "Artigos em destaque". */
export const FEATURED_LIMIT = 6;

/** Intervalo em que a ordem dos destaques é recalculada (ajustável). */
export const ROTATION_INTERVAL_MS = 1000 * 60 * 60 * 6;

/** Bucket inteiro estável para um intervalo qualquer (p.ex. destaques 6 h, populares 4 h). */
export function rotationBucketForInterval(ts: number, intervalMs: number): number {
  return Math.floor(ts / intervalMs);
}

export function rotationBucketFromTimestamp(ts: number): number {
  return rotationBucketForInterval(ts, ROTATION_INTERVAL_MS);
}

function parseFeaturedDateDdMmYyyy(dateStr: string): number {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return 0;
  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);
  if (!y || !m || !d) return 0;
  return new Date(y, m - 1, d).getTime();
}

/** Ordena do mais recente para o mais antigo (qualidade antes do shuffle). */
export function sortFeaturedPostsByDateDesc<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => parseFeaturedDateDdMmYyyy(b.date) - parseFeaturedDateDdMmYyyy(a.date));
}

/**
 * Embaralhamento determinístico (Fisher–Yates com PRNG por seed).
 * Usa cópia interna do seed para não mutar o argumento.
 */
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentIndex = result.length;
  let rng = seed;

  const random = () => {
    const x = Math.sin(rng++) * 10000;
    return x - Math.floor(x);
  };

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }

  return result;
}

/** Destaques para o bucket atual: ordena por data, embaralha, corta em FEATURED_LIMIT. */
export function pickRotatedFeaturedPosts<T extends { date: string }>(
  pool: T[],
  timeBucket: number,
): T[] {
  if (pool.length === 0) return [];
  const sorted = sortFeaturedPostsByDateDesc(pool);
  const shuffled = shuffleWithSeed(sorted, timeBucket);
  return shuffled.slice(0, FEATURED_LIMIT);
}
