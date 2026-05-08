/** Conteúdo estático da landing do blog (nova implementação). */

export type FeaturedPost = {
  href: string;
  category: string;
  categorySlug: string;
  badgeClass: string;
  image: string;
  title: string;
  excerpt: string;
  readMin: number;
  date: string;
};

/** Artigos em destaque — cada card aponta para uma única página em /blog/[slug]. */
export const FEATURED_POSTS: FeaturedPost[] = [
  {
    href: '/blog/erros-no-pomodoro',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950393/erros-no-pomodoro-pg-blog_onli2c.jpg',
    title: 'Erros no Pomodoro: os principais erros que estão sabotando seu foco',
    excerpt:
      'Por que Pomodoro não funciona na prática, erros na técnica, como corrigir e usar corretamente com foco — Pomodoro e timer online.',
    readMin: 11,
    date: '30/04/2026',
  },
  {
    href: '/blog/pomodoro-vs-multitarefa',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777951297/pomodoro-vs-multitarefa-pg-blog_efkbax.jpg',
    title: 'Pomodoro vs multitarefa: qual vence na produtividade?',
    excerpt:
      'Por que multitarefa atrapalha, foco numa tarefa rende mais, comparação direta e passos para aplicar com Pomodoro e timer online.',
    readMin: 11,
    date: '30/04/2026',
  },
  {
    href: '/blog/quantos-pomodoros-por-dia',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777946939/quantos-pomodoros-fazer-por-dia-pagina-blog_jgugck.jpg',
    title: 'Quantos Pomodoros fazer por dia? (guia por nível, estudo e trabalho)',
    excerpt:
      '3–8 ciclos típicos, tabela por objetivo, iniciante a avançado, erros que causam burnout e como começar com 2 Pomodoros hoje.',
    readMin: 12,
    date: '29/04/2026',
  },
  {
    href: '/blog/habitos-produtivos',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950019/habitos-produtivos-pg-blog_xe9fpf.jpg',
    title: 'Hábitos produtivos: como criar hábitos que realmente funcionam',
    excerpt:
      'Como criar hábitos pequenos e diários; gatilhos, Pomodoro, timer e despertador para hábitos que aumentam produtividade sem burnout.',
    readMin: 12,
    date: '03/05/2026',
  },
  {
    href: '/blog/por-que-procrastinamos',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948104/porque-voce-procastina-pg-blog_c3dxi6.jpg',
    title: 'Por que você procrastina? Entenda o que está por trás da falta de ação',
    excerpt:
      'Por que procrastinamos: causas da procrastinação, psicologia em linguagem simples e falta de motivação — caminho prático sem culpa.',
    readMin: 12,
    date: '03/05/2026',
  },
  {
    href: '/blog/como-parar-de-procrastinar',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777924132/pare-de-procastinar_pszydi.jpg',
    title: 'Como parar de procrastinar: técnicas simples para agir mais e adiar menos',
    excerpt:
      'Regra dos 5 minutos, Pomodoro e foco para parar de adiar tarefas — passos práticos sem depender só de motivação.',
    readMin: 11,
    date: '02/05/2026',
  },
  {
    href: '/blog/como-vencer-a-preguica',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777949226/como-vencer-a-preguica-pg-blog_qmrzdt.jpg',
    title: 'Como vencer a preguiça: estratégias simples para ter mais energia e ação',
    excerpt:
      'Mais disposição no dia a dia: sono, regra dos 5 minutos, Pomodoro e rotina — falta de energia e motivação, o que fazer sem culpa.',
    readMin: 11,
    date: '05/05/2026',
  },
  {
    href: '/blog/como-manter-consistencia',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777949465/como-manter-consistncia-pg-blog_zaw0ky.jpg',
    title:
      'Como manter consistência: o segredo para não desistir no meio do caminho',
    excerpt:
      'Consistência sem depender só de motivação: disciplina, rotina diária e como não desistir — Pomodoro, temporizador e despertador online.',
    readMin: 12,
    date: '04/05/2026',
  },
  {
    href: '/blog/intervalo-ideal-estudo',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950964/intervalo-ideal-de-estudo-pg-blog_dfvphn.jpg',
    title: 'Intervalo ideal de estudo: quanto descansar entre sessões de foco',
    excerpt:
      '25/5, pausas de 10 a 30 min, foco curto e longo, erros comuns e passo a passo com Pomodoro e timer online.',
    readMin: 12,
    date: '28/04/2026',
  },
  {
    href: '/blog/pomodoro',
    category: 'PRODUTIVIDADE',
    categorySlug: 'produtividade',
    badgeClass: 'bg-violet-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921516/tecnica-pomodoro-img-pagina-home_kzozrc.png',
    title: 'Como usar a técnica Pomodoro corretamente (guia completo para foco e produtividade)',
    excerpt:
      'Guia completo: origem do método, passo a passo 25/5, pausas longas, erros comuns, variações e ferramentas online gratuitas.',
    readMin: 10,
    date: '27/04/2026',
  },
  {
    href: '/blog/acordar-horario-certo',
    category: 'ROTINA',
    categorySlug: 'rotina',
    badgeClass: 'bg-rose-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921740/despertador-_hora-certa-img-pagina-home_mfbwus.png',
    title: 'Despertar no horário certo',
    excerpt:
      'Sono regular, alarme no navegador e rotina matinal para acordar no horário combinado, com menos snooze.',
    readMin: 10,
    date: '18/04/2026',
  },
  {
    href: '/blog/como-acordar-cedo',
    category: 'ROTINA',
    categorySlug: 'rotina',
    badgeClass: 'bg-rose-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777952206/acordar-cedo-sem-sofrimento-pg-blog_jjtv3j.jpg',
    title: 'Como acordar cedo e manter consistência (sem sofrimento)',
    excerpt:
      'Como acordar cedo todos os dias: sono, hábito noturno, celular antes de dormir e despertador online — menos motivação, mais sistema.',
    readMin: 12,
    date: '01/05/2026',
  },
  {
    href: '/blog/criar-rotina-diaria',
    category: 'ROTINA',
    categorySlug: 'rotina',
    badgeClass: 'bg-rose-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947280/como-criar-rotina-diaria-pg-blog_a7utuu.jpg',
    title: 'Como criar uma rotina diária produtiva (passo a passo simples)',
    excerpt:
      'Rotina produtiva sem perfeccionismo: prioridades, blocos no dia, exemplo manhã/tarde/noite e timer, Pomodoro e despertador.',
    readMin: 12,
    date: '02/05/2026',
  },
  {
    href: '/blog/rotina-matinal-ideal',
    category: 'ROTINA',
    categorySlug: 'rotina',
    badgeClass: 'bg-rose-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777951797/rotina-matinal-ideal-pg-blog_koywdu.jpg',
    title:
      'Rotina matinal ideal: como começar o dia com foco e produtividade',
    excerpt:
      'Manhã produtiva: hábitos matinais, exemplo simples e como começar o dia bem — despertador, Pomodoro e temporizador online.',
    readMin: 12,
    date: '05/05/2026',
  },
  {
    href: '/blog/lembretes-5-minutos',
    category: 'HÁBITO',
    categorySlug: 'habito',
    badgeClass: 'bg-emerald-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921966/lembrete-a-cada-5-minutos-pagina-home_u2e9k8.png',
    title: 'Lembretes a cada 5 minutos',
    excerpt:
      'Micro lembretes no trabalho e em casa: exemplos práticos e alarme online sem poluir com notificações.',
    readMin: 9,
    date: '24/04/2026',
  },
  {
    href: '/blog/intervalo-10-minutos',
    category: 'FOCO',
    categorySlug: 'foco',
    badgeClass: 'bg-sky-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922332/pausa-entre-tarefas-pagina-home_hcfycz.png',
    title: 'Intervalo de 10 minutos entre tarefas',
    excerpt:
      'Pausas de 10 minutos entre blocos: ritmo produtivo, despertador e ligação com Pomodoro.',
    readMin: 9,
    date: '16/04/2026',
  },
  {
    href: '/blog/despertador-estudar',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922947/despertador-para-estudar-pagina_home_v7n7fu.jpg',
    title: 'Despertador para estudar',
    excerpt:
      'Blocos de foco, pausas e alarme online para manter disciplina nos estudos sem depender só da força de vontade.',
    readMin: 10,
    date: '26/04/2026',
  },
  {
    href: '/blog/quanto-tempo-estudar-por-dia',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777952636/quanto-tempo-estudar-por-dia-pg-blog_priwo4.jpg',
    title:
      'Quanto tempo estudar por dia? O ideal para aprender mais sem se cansar',
    excerpt:
      'Faixas por nível (iniciante a avançado): quantas horas, pausas, rotina — Pomodoro, temporizador e cronômetro online.',
    readMin: 13,
    date: '06/05/2026',
  },
  {
    href: '/blog/como-revisar-conteudo',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947837/como-memorizar-conteudo-pg-blog_hng1iw.jpg',
    title: 'Como revisar conteúdo corretamente e lembrar por mais tempo',
    excerpt:
      'Como revisar conteúdo e matéria: revisão ativa, espaçada, perguntas, rotina — Pomodoro, temporizador e cronômetro online.',
    readMin: 13,
    date: '07/05/2026',
  },
  {
    href: '/blog/como-estudar-com-foco',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947524/como-estudar-com-foco-pg-blog_bn5y1c.jpg',
    title: 'Como estudar com foco: técnicas simples para manter a concentração',
    excerpt:
      'Como manter concentração e estudar sem distrações: ambiente, blocos, Pomodoro e pausas — temporizador e cronômetro online.',
    readMin: 13,
    date: '08/05/2026',
  },
  {
    href: '/blog/como-memorizar-mais-rapido',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948870/como-memorizar-mais-rapido-pg-blog_haoxk5.jpg',
    title:
      'Como memorizar mais rápido: técnicas simples para aprender melhor',
    excerpt:
      'Memória e estudo: revisão ativa, espaçamento, Pomodoro e pausas — temporizador e cronômetro para aplicar no dia a dia.',
    readMin: 13,
    date: '09/05/2026',
  },
  {
    href: '/blog/tecnicas-de-estudo-que-funcionam',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948639/tecnicas-de-estudo-que-funcionam-pg-blog_vf7mtc.jpg',
    title:
      'Técnicas de estudo que funcionam: métodos simples para aprender melhor',
    excerpt:
      'Pomodoro, revisão ativa e repetição espaçada: métodos para estudar com eficiência — temporizador e cronômetro online.',
    readMin: 13,
    date: '10/05/2026',
  },
  {
    href: '/blog/como-aprender-melhor',
    category: 'ESTUDOS',
    categorySlug: 'estudos',
    badgeClass: 'bg-amber-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948404/como-aprender-melhor-pg-blog_dyr0ak.jpg',
    title:
      'Como aprender melhor: estratégias simples para absorver mais conteúdo',
    excerpt:
      'Absorver, entender e reter: foco, revisão e prática — Pomodoro, temporizador e cronômetro online.',
    readMin: 13,
    date: '11/05/2026',
  },
  {
    href: '/blog/disciplina-planejamento',
    category: 'ORGANIZAÇÃO',
    categorySlug: 'organizacao',
    badgeClass: 'bg-indigo-600',
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777923189/planejamento-e-disciplina-pagina-home_s5twcr.jpg',
    title: 'Do planejado ao feito: disciplina',
    excerpt:
      'Sair da lista infinita: blocos no calendário, buffers e ferramentas grátis para executar o planejado.',
    readMin: 11,
    date: '20/04/2026',
  },
];

export const CATEGORY_CHIPS = [
  { label: 'Produtividade', slug: 'produtividade' },
  { label: 'Rotina', slug: 'rotina' },
  { label: 'Estudos', slug: 'estudos' },
  { label: 'Organização', slug: 'organizacao' },
] as const;

const featuredDateByHref = new Map(FEATURED_POSTS.map((p) => [p.href, p.date]));

export type PopularPost = {
  href: string;
  title: string;
  readMin: number;
  image: string;
  date: string;
};

const POPULAR_POSTS_BASE = [
  {
    href: '/blog/erros-no-pomodoro',
    title: 'Erros no Pomodoro: os principais erros que estão sabotando seu foco',
    readMin: 11,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950393/erros-no-pomodoro-pg-blog_onli2c.jpg',
  },
  {
    href: '/blog/pomodoro-vs-multitarefa',
    title: 'Pomodoro vs multitarefa: qual vence na produtividade?',
    readMin: 11,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777951297/pomodoro-vs-multitarefa-pg-blog_efkbax.jpg',
  },
  {
    href: '/blog/quantos-pomodoros-por-dia',
    title: 'Quantos Pomodoros fazer por dia? (guia por nível, estudo e trabalho)',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777946939/quantos-pomodoros-fazer-por-dia-pagina-blog_jgugck.jpg',
  },
  {
    href: '/blog/habitos-produtivos',
    title: 'Hábitos produtivos: como criar hábitos que realmente funcionam',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950019/habitos-produtivos-pg-blog_xe9fpf.jpg',
  },
  {
    href: '/blog/por-que-procrastinamos',
    title: 'Por que você procrastina? Entenda o que está por trás da falta de ação',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948104/porque-voce-procastina-pg-blog_c3dxi6.jpg',
  },
  {
    href: '/blog/como-parar-de-procrastinar',
    title: 'Como parar de procrastinar: técnicas simples para agir mais e adiar menos',
    readMin: 11,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777924132/pare-de-procastinar_pszydi.jpg',
  },
  {
    href: '/blog/como-vencer-a-preguica',
    title: 'Como vencer a preguiça: estratégias simples para ter mais energia e ação',
    readMin: 11,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777949226/como-vencer-a-preguica-pg-blog_qmrzdt.jpg',
  },
  {
    href: '/blog/como-manter-consistencia',
    title:
      'Como manter consistência: o segredo para não desistir no meio do caminho',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777949465/como-manter-consistncia-pg-blog_zaw0ky.jpg',
  },
  {
    href: '/blog/intervalo-ideal-estudo',
    title: 'Intervalo ideal de estudo: quanto descansar entre sessões de foco',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777950964/intervalo-ideal-de-estudo-pg-blog_dfvphn.jpg',
  },
  {
    href: '/blog/quanto-tempo-estudar-por-dia',
    title:
      'Quanto tempo estudar por dia? O ideal para aprender mais sem se cansar',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777952636/quanto-tempo-estudar-por-dia-pg-blog_priwo4.jpg',
  },
  {
    href: '/blog/como-revisar-conteudo',
    title: 'Como revisar conteúdo corretamente e lembrar por mais tempo',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947837/como-memorizar-conteudo-pg-blog_hng1iw.jpg',
  },
  {
    href: '/blog/como-estudar-com-foco',
    title:
      'Como estudar com foco: técnicas simples para manter a concentração',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947524/como-estudar-com-foco-pg-blog_bn5y1c.jpg',
  },
  {
    href: '/blog/como-memorizar-mais-rapido',
    title:
      'Como memorizar mais rápido: técnicas simples para aprender melhor',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948870/como-memorizar-mais-rapido-pg-blog_haoxk5.jpg',
  },
  {
    href: '/blog/tecnicas-de-estudo-que-funcionam',
    title:
      'Técnicas de estudo que funcionam: métodos simples para aprender melhor',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948639/tecnicas-de-estudo-que-funcionam-pg-blog_vf7mtc.jpg',
  },
  {
    href: '/blog/como-aprender-melhor',
    title:
      'Como aprender melhor: estratégias simples para absorver mais conteúdo',
    readMin: 13,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777948404/como-aprender-melhor-pg-blog_dyr0ak.jpg',
  },
  {
    href: '/blog/pomodoro',
    title: 'Como usar a técnica Pomodoro corretamente (guia completo para foco e produtividade)',
    readMin: 10,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921516/tecnica-pomodoro-img-pagina-home_kzozrc.png',
  },
  {
    href: '/blog/acordar-horario-certo',
    title: 'Despertar no horário certo',
    readMin: 10,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921740/despertador-_hora-certa-img-pagina-home_mfbwus.png',
  },
  {
    href: '/blog/como-acordar-cedo',
    title: 'Como acordar cedo e manter consistência (sem sofrimento)',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777952206/acordar-cedo-sem-sofrimento-pg-blog_jjtv3j.jpg',
  },
  {
    href: '/blog/criar-rotina-diaria',
    title: 'Como criar uma rotina diária produtiva (passo a passo simples)',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777947280/como-criar-rotina-diaria-pg-blog_a7utuu.jpg',
  },
  {
    href: '/blog/rotina-matinal-ideal',
    title:
      'Rotina matinal ideal: como começar o dia com foco e produtividade',
    readMin: 12,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777951797/rotina-matinal-ideal-pg-blog_koywdu.jpg',
  },
  {
    href: '/blog/lembretes-5-minutos',
    title: 'Lembretes a cada 5 minutos',
    readMin: 9,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777921966/lembrete-a-cada-5-minutos-pagina-home_u2e9k8.png',
  },
  {
    href: '/blog/intervalo-10-minutos',
    title: 'Intervalo de 10 minutos entre tarefas',
    readMin: 9,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922332/pausa-entre-tarefas-pagina-home_hcfycz.png',
  },
  {
    href: '/blog/despertador-estudar',
    title: 'Despertador para estudar',
    readMin: 10,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777922947/despertador-para-estudar-pagina_home_v7n7fu.jpg',
  },
  {
    href: '/blog/disciplina-planejamento',
    title: 'Do planejado ao feito: disciplina',
    readMin: 11,
    image:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1777923189/planejamento-e-disciplina-pagina-home_s5twcr.jpg',
  },
] as const;

export const POPULAR_POSTS: PopularPost[] = POPULAR_POSTS_BASE.map((p) => ({
  href: p.href,
  title: p.title,
  readMin: p.readMin,
  image: p.image,
  date: featuredDateByHref.get(p.href) ?? '01/01/2020',
}));

/** Slugs/títulos planejados para expansão (sem páginas ainda — usar ao criar `defineBlogArticle`). */
export const UPCOMING_BLOG_TOPICS = [
  { slug: 'parar-de-procrastinar', title: 'Como parar de procrastinar' },
  { slug: 'melhor-horario-para-estudar', title: 'Melhor horário para estudar' },
  { slug: 'rotina-produtiva-diaria', title: 'Rotina produtiva diária' },
] as const;

export const GUIDE_ITEMS = [
  {
    href: '/despertador-5-minutos',
    title: 'Despertador de 5 minutos',
    desc: 'Lembretes curtos para hábitos e microtarefas ao longo do dia.',
  },
  {
    href: '/despertador-10-minutos',
    title: 'Despertador de 10 minutos',
    desc: 'Intervalos de dez minutos entre blocos de trabalho ou estudo.',
  },
  {
    href: '/despertador-15-minutos',
    title: 'Despertador de 15 minutos',
    desc: 'Organize pausas e revisões rápidas sem perder o fio à meada.',
  },
  {
    href: '/despertador-30-minutos',
    title: 'Despertador de 30 minutos',
    desc: 'Meia hora para foco profundo ou sessões de estudo estruturadas.',
  },
  {
    href: '/despertador-45-minutos',
    title: 'Despertador de 45 minutos',
    desc: 'Blocos mais longos para aulas, reuniões ou treino concentrado.',
  },
  {
    href: '/despertador-60-minutos',
    title: 'Despertador de 60 minutos',
    desc: 'Uma hora inteira para projetos que exigem continuidade.',
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: 'O relógio online é realmente preciso?',
    a: 'Sim. Sincronizamos com fontes de tempo em rede e compensamos latência; o navegador aplica as regras de fuso (IANA). Para uso contratual ou aviação, confirme sempre com uma fonte oficial.',
  },
  {
    q: 'Como funcionam os fusos horários?',
    a: 'Cada região segue um offset em relação ao UTC, com possível horário de verão. O site usa o fuso do seu dispositivo ou localização estimada para mostrar a hora local correta.',
  },
  {
    q: 'O despertador funciona se eu fechar o navegador?',
    a: 'Em geral não: com o separador fechado o temporizador do lado do cliente deixa de correr. Mantenha o site aberto (ou em segundo plano no telemóvel, conforme o sistema) para o alarme disparar.',
  },
  {
    q: 'Posso usar no celular?',
    a: 'Sim. O site é responsivo e funciona nos principais navegadores móveis; permita notificações/áudio se o browser pedir.',
  },
  {
    q: 'É gratuito mesmo?',
    a: 'Sim. As ferramentas e artigos são gratuitos; o site pode exibir anúncios para manter o serviço.',
  },
] as const;

export const CTA_TOOLS = [
  { href: '/', label: 'Relógio', icon: 'clock' as const },
  { href: '/despertador', label: 'Despertador', icon: 'alarm' as const },
  { href: '/cronometro', label: 'Cronômetro', icon: 'stopwatch' as const },
  { href: '/temporizador', label: 'Temporizador', icon: 'timer' as const },
  { href: '/pomodoro', label: 'Pomodoro', icon: 'pomodoro' as const },
  { href: '/hora-mundial', label: 'Hora mundial', icon: 'globe' as const },
] as const;
