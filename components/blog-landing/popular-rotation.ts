import { shuffleWithSeed, sortFeaturedPostsByDateDesc } from '@/components/blog-landing/featured-rotation';

/** Quantidade de itens no bloco "Mais populares" da lateral. */
export const POPULAR_LIMIT = 7;

/** Lista lateral renova a ordenação a cada 4 h (ajustável). */
export const POPULAR_ROTATION_INTERVAL_MS = 1000 * 60 * 60 * 4;

export function popularRotationBucketFromTimestamp(ts: number): number {
  return Math.floor(ts / POPULAR_ROTATION_INTERVAL_MS);
}

/** Ordena por data (relevância), embaralha com seed do intervalo, corta em POPULAR_LIMIT. */
export function pickRotatedPopularPosts<T extends { date: string }>(
  pool: T[],
  timeBucket: number,
): T[] {
  if (pool.length === 0) return [];
  const sorted = sortFeaturedPostsByDateDesc(pool);
  const shuffled = shuffleWithSeed(sorted, timeBucket);
  return shuffled.slice(0, POPULAR_LIMIT);
}
