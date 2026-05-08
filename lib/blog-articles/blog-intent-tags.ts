/**
 * Tags de intenção na landing do blog (“O que você quer melhorar?”).
 * Slugs estáveis em minúsculas, sem acento — usados em `BlogArticle.tags`.
 */
export const BLOG_INTENT_TAG_IDS = ['foco', 'rotina', 'estudos', 'procrastinacao'] as const;

export type BlogIntentTagId = (typeof BLOG_INTENT_TAG_IDS)[number];

export const BLOG_INTENT_TAG_LABELS: Record<BlogIntentTagId, string> = {
  foco: 'Foco',
  rotina: 'Rotina',
  estudos: 'Estudos',
  procrastinacao: 'Procrastinação',
};

/** Metadados dos botões de intenção (alinha hero + seção “O que melhorar”). */
export const BLOG_INTENT_GOALS: readonly {
  title: string;
  body: string;
  tagId: BlogIntentTagId;
}[] = [
  {
    title: 'Melhorar foco',
    body: 'Blocos de atenção, Pomodoro e menos interrupções no dia.',
    tagId: 'foco',
  },
  {
    title: 'Criar rotina',
    body: 'Hábitos, lembretes e constância sem depender só da memória.',
    tagId: 'rotina',
  },
  {
    title: 'Estudar melhor',
    body: 'Disciplina na mesa, pausas e uso inteligente do alarme.',
    tagId: 'estudos',
  },
  {
    title: 'Parar procrastinação',
    body: 'Sair da lista infinita e executar o que já foi planejado.',
    tagId: 'procrastinacao',
  },
];
