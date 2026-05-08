/** Utilitários de debug: nunca devem ser chamados em código que só roda em produção sem checagem prévia. */

export function debugLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

export function debugWarn(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
}

export function debugTable(data: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.table(data);
  }
}
