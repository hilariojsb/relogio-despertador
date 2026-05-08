import { defineBlogArticle } from '@/lib/blog-articles/validate-blog-article';

export const articleDisciplinaPlanejamento = defineBlogArticle({
  slug: 'disciplina-planejamento',
  title: 'Do planejado ao feito: disciplina',
  description:
    'Como sair da lista infinita e executar o que planejou: blocos no calendário, buffers, Pomodoro e ferramentas grátis no site.',
  tagline: 'Cada hora com dono — do calendário vazio ao dia que você realmente cumpre.',
  publishedAt: '2026-04-20',
  readMinutes: 11,
  category: 'Organização',
  tags: ['foco', 'rotina'],
  keywords: [
    'disciplina e planejamento',
    'time blocking',
    'blocos de tempo',
    'executar o planejado',
    'gestão do tempo',
    'produtividade',
    'foco no trabalho',
    'organizar o dia',
  ],
  quickSummary: [
    'Sair do planejado ao feito exige blocos no calendário, buffers realistas e ritmo que você repete amanhã.',
    'Time blocking coloca dono em cada hora — a lista para de competir com vinte urgências invisíveis.',
    'Pomodoro e temporizador encaixam dentro dos blocos; margens absorvem imprevistos sem culpa.',
    'Despertador online ajuda a cravar começo, pausa e revisão no fim do dia.',
  ],
  heroImage: {
    src: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777923189/planejamento-e-disciplina-pagina-home_s5twcr.jpg',
    alt: 'Planejamento do dia e execução com disciplina.',
  },
  midArticleImage: {
    src: 'https://res.cloudinary.com/dtqplznus/image/upload/v1778023384/Do_que_est%C3%A1_escrito_ao_que_acontece_no_rel%C3%B3gio_loqkxa.jpg',
    alt:
      'Grade de calendário ou agenda em 3D: lado organizado e lado que se fragmenta, metáfora do plano versus o tempo real.',
    afterSectionIndex: 0,
  },
  intro: [
    'Listas infinitas dão sensação de controlo, mas não alocam o tempo limitado que você tem acordado. Passar do planejado ao feito exige combinar intenção com o relógio: blocos nomeados, margem para imprevistos e ritmo de foco que você consegue repetir amanhã — não só hoje em surto de motivação.',
    'Este guia traduz time blocking e hábitos de execução para quem usa o navegador no dia a dia: como reservar blocos realistas, como integrar Pomodoro dentro deles, como buffers evitam frustração e como despertador e temporizador fecham o ciclo “decidi → fiz → revisei”.',
    'Ao final, você terá um esqueleto de disciplina verificável: menos “eu devia” e mais “neste bloco eu cumpri o combinado” — com ajustes semanais em vez de abandonar o sistema na primeira interrupção.',
  ],
  sections: [
    {
      h2: 'Do que está escrito ao que acontece no relógio',
      paragraphs: [
        'Disciplina operacional não é força de vontade abstrata; é alinhar três camadas: resultado do dia (o quê), janela temporal (quando) e limite de tempo (quanto dura o compromisso). Sem a segunda, a lista vira arquivo; sem a terceira, o bloco derrete em multitarefa.',
        'Reserve blocos para trabalho focado, comunicação, administração e descanso. Omitir pausas e deslocamentos cria planos que quebram à primeira hora — e culpa injusta com o método.',
      ],
      list: [
        'Verbo + resultado em cada bloco: “Redigir introdução”, não “trabalhar”.',
        'Buffer entre blocos pesados para absorver atraso real.',
        'Revisão curta de manhã e tarde: cinco a dez minutos para mover o que mudou.',
      ],
      highlights: [
        {
          variant: 'tip',
          body: 'No primeiro mês, ocupe só 50–60% do horário útil com blocos nomeados — deixe folga real para imprevistos e para trabalho informal que também conta.',
        },
      ],
    },
    {
      h2: 'Montando o primeiro dia executável',
      paragraphs: [
        'Escolha três entregas que tornariam o dia satisfatório. Estime tempo bruto (incluindo revisão). Coloque tarefas difíceis nas janelas em que, historicamente, tem mais energia. Use temporizador para fechar planejamento: “dez minutos para organizar o calendário e começo o primeiro bloco”.',
      ],
      subsections: [
        {
          h3: 'Quando surge urgência',
          paragraphs: [
            'Disciplina é decidir o custo do desvio: mover bloco, reduzir escopo ou cancelar o de menor impacto — de forma explícita. Sem isso, o cérebro conclui que “planejar não serve” quando o que falhou foi a negociação com o tempo.',
          ],
        },
      ],
    },
    {
      h2: 'Pomodoro dentro do bloco do calendário',
      paragraphs: [
        'Um bloco de sessenta minutos pode comportar dois ciclos 25/5 com margem de transição. O calendário dá contexto (“nesta hora sou autor do relatório”); o Pomodoro dá ritmo (“nestes 25 minutos só rascunho, não edição”).',
        'Sem sub-limites, blocos longos viram navegação entre abas. Ajuste durações se 25 minutos não couber no seu foco, mas mantenha pausa respeitada como contrato.',
      ],
    },
    {
      h2: 'Armadilhas: calendário cheio, execução vazia',
      paragraphs: [
        'Colorir cada minuto sem cumprir gera culpa. Planejar demais e executar de menos é comum: limite o “ajuste fino” com alarme curto e inicie o primeiro bloco mesmo imperfeito.',
      ],
      list: [
        'Blocos sempre quebrados: a carga prometida pode estar acima da real — reduza ou negocie fora.',
        'Blocos sempre sobrando tempo: aumente ambição gradualmente nos tipos de tarefa que já domina.',
      ],
      highlights: [
        {
          variant: 'warning',
          body: 'Se passar mais tempo rearranjando o calendário do que cumprir o primeiro bloco, use um lembrete único: após dez minutos de planejamento, o próximo passo é execução, não mais reorganização.',
        },
      ],
    },
    {
      h2: 'Ferramentas do site no ciclo planejar → executar → medir',
      paragraphs: [
        'O relógio online ancora o “agora” enquanto corre o bloco. O despertador marca transições quando precisa de som confiável. O temporizador fecha tarefas com duração fixa dentro do bloco; o cronômetro mediu quanto tempo a tarefa levou — dados para calibrar amanhã. O Pomodoro automatiza foco e pausa quando o bloco já foi decidido em ciclos.',
      ],
    },
  ],
  conclusion: [
    'Disciplina é manter acordo honesto com o tempo: o que entrou no calendário foi tentado; o que não foi possível gerou ajuste visível, não silêncio culpado. Integrando buffers, foco em sub-blocos e medição simples, o dia deixa de ser lista abstrata e vira sequência de compromissos que você pode revisar.',
    'Teste amanhã três blocos de pelo menos quarenta minutos com resultado observável e use o temporizador para honrar o fim do primeiro. Ao final, pergunte se essa clareza ajudou; calibre na quarta-feira, não desista na segunda.',
  ],
  tip: 'Reserve semanalmente trinta minutos de “manutenção do sistema”: o que funcionou, o que foi ignorado e por quê. Planejamento sem feedback fecha o ciclo de melhoria.',
});
