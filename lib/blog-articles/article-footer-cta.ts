export type ArticleFooterSecondaryLink = {
  href: string;
  label: string;
};

export type ArticleFooterCta = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLinks: ArticleFooterSecondaryLink[];
};

const BY_CATEGORY: Record<string, ArticleFooterCta> = {
  Estudos: {
    title: 'Hora de transformar leitura em retenção',
    description: 'Use o Pomodoro para estudar em blocos focados sem cansar a mente.',
    primaryLabel: 'Iniciar Pomodoro',
    primaryHref: '/pomodoro',
    secondaryLinks: [
      { href: '/temporizador', label: 'Temporizador' },
      { href: '/cronometro', label: 'Cronômetro' },
      { href: '/despertador', label: 'Despertador' },
    ],
  },
  Produtividade: {
    title: 'Pare de só organizar. Comece agora.',
    description: 'Inicie um bloco de foco e transforme intenção em ação real.',
    primaryLabel: 'Iniciar foco',
    primaryHref: '/pomodoro',
    secondaryLinks: [
      { href: '/temporizador', label: 'Temporizador' },
      { href: '/cronometro', label: 'Cronômetro' },
      { href: '/despertador', label: 'Despertador' },
    ],
  },
  Rotina: {
    title: 'Sua próxima rotina começa agora',
    description:
      'Configure um despertador ou lembrete e mantenha consistência sem depender de motivação.',
    primaryLabel: 'Configurar despertador',
    primaryHref: '/despertador',
    secondaryLinks: [
      { href: '/temporizador', label: 'Temporizador' },
      { href: '/pomodoro', label: 'Pomodoro' },
      { href: '/cronometro', label: 'Cronômetro' },
    ],
  },
  Organização: {
    title: 'Organize o próximo bloco agora',
    description: 'Defina tempo, prioridade e comece com clareza.',
    primaryLabel: 'Abrir temporizador',
    primaryHref: '/temporizador',
    secondaryLinks: [
      { href: '/cronometro', label: 'Cronômetro' },
      { href: '/pomodoro', label: 'Pomodoro' },
      { href: '/despertador', label: 'Despertador' },
    ],
  },
};

/** CTA genérico quando a categoria não está mapeada (novos artigos, typo, etc.). */
const FALLBACK: ArticleFooterCta = BY_CATEGORY.Produtividade;

function normalizeCategoryKey(raw: string): string {
  return raw
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

/**
 * Conteúdo do CTA final do artigo, alinhado à categoria editorial (Estudos, Produtividade, Rotina, Organização).
 */
export function getArticleFooterCta(category: string): ArticleFooterCta {
  const trimmed = category.trim();
  if (trimmed in BY_CATEGORY) {
    return BY_CATEGORY[trimmed];
  }
  const norm = normalizeCategoryKey(trimmed);
  const match = Object.keys(BY_CATEGORY).find((k) => normalizeCategoryKey(k) === norm);
  if (match) return BY_CATEGORY[match];
  return FALLBACK;
}
