/**
 * Lista parcial ou completa para hubs com “mostrar mais”.
 */
export function getVisibleArticles<T>(articles: T[], showAll: boolean, limit = 3): T[] {
  return showAll ? articles : articles.slice(0, limit);
}
