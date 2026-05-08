/** Conteúdo enxuto — alinhado ao wireframe / copy fixa. */

export const c = {
  label: 'DESPERTADOR ONLINE',
  h1: 'Despertador online grátis',
  /** Três linhas (hero) — igual ao reference */
  descLines: [
    'Crie alarmes personalizados e receba o aviso no horário',
    'certo, direto no seu navegador. Simples, rápido e sem',
    'precisar instalar nada.',
  ] as const,
  bullets: [
    'Alarmes ilimitados',
    'Funciona em segundo plano',
    'Personalize rótulos e volume',
    '100% online e gratuito',
  ] as const,
} as const;

export const whyTitle = 'POR QUE USAR O DESPERTADOR ONLINE?';
export const whySub =
  'Crie e gerencie alarmes no seu navegador, sem complicação e de forma 100% gratuita.';

export const whyItems = [
  { title: 'Lembretes fáceis', text: 'Alarme para estudo, trabalho ou medicação.', key: 'bell' as const },
  { title: 'Fácil de ajustar', text: 'Hora, rótulo e volume com poucos toques.', key: 'clock' as const },
  { title: 'Sons audíveis', text: 'Volume ajustado ao ambiente.', key: 'speaker' as const },
  { title: 'Privacidade', text: 'Os dados permanecem no dispositivo.', key: 'shield' as const },
] as const;

export const howTitle = 'COMO USAR O DESPERTADOR ONLINE';
export const howSub = 'Aqui, alarmes ilimitados e 100% gratuitos em poucos passos.';

export const howSteps = [
  { n: 1, title: 'Crie um alarme', text: 'Defina hora e, se quiser, um título personalizado.' },
  { n: 2, title: 'Ajuste o rótulo', text: 'Identifique cada alarme (estudo, pausa, remédio).' },
  { n: 3, title: 'Defina o som', text: 'Controle o volume e teste o alerta.' },
  { n: 4, title: 'Mantenha a aba ativa', text: 'Garanta que a página fique acessível.' },
] as const;

export const tipsTitle = 'DICAS PARA APROVEITAR MELHOR SEUS';
export const tipsTitleSpan = 'alarmes';
export const tipsSub = 'Aproveite tudo o que a ferramenta oferece com essas dicas rápidas.';

export const tips = [
  {
    href: '/blog/pomodoro' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921516/tecnica-pomodoro-img-pagina-home_kzozrc.png',
    tag: 'PRODUTIVIDADE' as const,
    tagClass: 'bg-violet-600/95' as const,
    title: 'Como usar a técnica Pomodoro corretamente (guia completo para foco e produtividade)',
    excerpt:
      'Guia completo: origem, passo a passo 25/5, erros comuns, variações e ferramentas online gratuitas.',
  },
  {
    href: '/blog/acordar-horario-certo' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921740/despertador-_hora-certa-img-pagina-home_mfbwus.png',
    tag: 'ROTINA' as const,
    tagClass: 'bg-rose-600/95' as const,
    title: 'Despertar no horário certo',
    excerpt: 'Sono regular, alarme online e rotina matinal com menos snooze.',
  },
  {
    href: '/blog/lembretes-5-minutos' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921966/lembrete-a-cada-5-minutos-pagina-home_u2e9k8.png',
    tag: 'HÁBITO' as const,
    tagClass: 'bg-emerald-600/95' as const,
    title: 'Lembretes a cada 5 minutos',
    excerpt: 'Micro lembretes no trabalho e em casa sem poluir com notificações.',
  },
  {
    href: '/blog/intervalo-10-minutos' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922332/pausa-entre-tarefas-pagina-home_hcfycz.png',
    tag: 'FOCO' as const,
    tagClass: 'bg-sky-600/95' as const,
    title: 'Intervalo de 10 minutos entre tarefas',
    excerpt: 'Pausas de 10 minutos entre blocos e ligação com Pomodoro.',
  },
  {
    href: '/blog/despertador-estudar' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922947/despertador-para-estudar-pagina_home_v7n7fu.jpg',
    tag: 'ESTUDOS' as const,
    tagClass: 'bg-amber-600/95' as const,
    title: 'Despertador para estudar',
    excerpt: 'Blocos de foco, pausas e alarme online para manter disciplina nos estudos.',
  },
  {
    href: '/blog/disciplina-planejamento' as const,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777923189/planejamento-e-disciplina-pagina-home_s5twcr.jpg',
    tag: 'ORGANIZAÇÃO' as const,
    tagClass: 'bg-indigo-600/95' as const,
    title: 'Do planejado ao feito: disciplina',
    excerpt: 'Blocos no calendário, buffers e ferramentas grátis para executar o planejado.',
  },
] as const;

export const faqItems = [
  { q: 'O alarme toca com a aba fechada?', a: 'A aba precisa estar ativa. Mantenha-a aberta em segundo plano se possível.' },
  { q: 'Preciso criar uma conta?', a: 'Não. O despertador funciona sem cadastro, direto no navegador.' },
  { q: 'Quantos alarmes posso ter?', a: 'Vários. Adicione quantos precisar, sem limite na ferramenta.' },
  { q: 'O volume é ajustável?', a: 'Sim, use o controle de volume antes de salvar o alarme.' },
  { q: 'Funciona no celular?', a: 'Sim, em navegadores modernes em Android e iOS.' },
] as const;

export const related = [
  { href: '/despertador' as const, text: 'despertador online grátis' },
  { href: '/blog/despertador-estudar' as const, text: 'alarme para estudar' },
  { href: '/blog/lembretes-5-minutos' as const, text: 'lembretes a cada 5 minutos' },
  { href: '/blog/intervalo-10-minutos' as const, text: 'intervalo de 10 minutos' },
  { href: '/blog/acordar-horario-certo' as const, text: 'despertar no horário certo' },
  { href: '/blog/pomodoro' as const, text: 'guia da técnica Pomodoro' },
] as const;

export const cta = {
  title: 'Pronto para nunca mais esquecer?',
  desc: 'Crie o próximo alerta no bloco de alarmes acima e acompanhe os ativos no mesmo cartão.',
} as const;

export const heroSectionId = 'despertador-hero' as const;
