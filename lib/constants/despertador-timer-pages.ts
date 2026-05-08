/** Páginas /despertador-{N}-minutos — layout compartilhado por DespertadorBasePage */

import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants/site';

export const TIMER_PAGE_MINUTES = [5, 10, 15, 30, 45, 60] as const;
export type TimerPageMinutes = (typeof TIMER_PAGE_MINUTES)[number];

export function timerPagePath(minutes: TimerPageMinutes): string {
  return `/despertador-${minutes}-minutos`;
}

export type DespertadorTimerPageConfig = {
  title: string;
  subtitle: string;
  description: string;
  useCases: string[];
  mindset: string;
  benefitLead: string;
  benefits: Array<{ title: string; text: string }>;
  howSteps: Array<{ n: number; title: string; text: string }>;
  seoDescription: string;
  progressionTargets: TimerPageMinutes[];
};

function prog(...mins: TimerPageMinutes[]): TimerPageMinutes[] {
  return mins;
}

export const TIMER_CONFIG: Record<TimerPageMinutes, DespertadorTimerPageConfig> = {
  5: {
    title: 'Despertador de 5 minutos',
    subtitle: 'Comece rápido com microtarefas',
    description:
      'Cinco minutos eliminam a fricção de “começo depois”. Ideal para hábitos mínimos, lembretes e o primeiro golpe contra a procrastinação.',
    useCases: ['Beber água ou alongar rápido', 'Responder mensagens urgentes sem abrir redes', 'Organizar a mesa ou inbox', 'Um parágrafo, uma questão ou um item da lista'],
    mindset: 'Rápido. Sem desculpas.',
    benefitLead: 'Sensação imediata de vitória sem prometer horas de foco.',
    benefits: [
      { title: 'Baixa resistência', text: 'O cérebro aceita “só cinco minutos” — depois você decide se continua.' },
      { title: 'Lembretes vivos', text: 'Medicamento, postura, água: leve o suficiente para não virar ruído.' },
      { title: 'Entrada no trabalho', text: 'Perfeito como rampa antes de um bloco maior (10 ou 15 min).' },
    ],
    howSteps: [
      { n: 1, title: 'Defina um único resultado', text: 'Uma ação pequena e verificável até o alarme tocar.' },
      { n: 2, title: 'Arme +5 min ou o horário', text: 'Use o atalho ou o campo de tempo; nomeie se quiser (ex.: “água”).' },
      { n: 3, title: 'Confirme e mantenha a aba', text: 'Permita áudio; ajuste o volume antes de sair para outra tela.' },
      { n: 4, title: 'Pare ao tocar ou encadeie', text: 'Avance para 10 min se o fluxo aparecer ou feche com “feito”.' },
    ],
    seoDescription:
      'Despertador de 5 minutos online grátis: microlembretes, microtarefas e hábitos rápidos no navegador. Armazenamento local, sem app.',
    progressionTargets: prog(10, 15, 30),
  },

  10: {
    title: 'Despertador de 10 minutos',
    subtitle: 'Intervalos inteligentes entre tarefas',
    description:
      'Dez minutos dão espaço para respirar ou retomar foco sem “sumir” do trabalho. Funciona entre reuniões, blocos de estudo ou pausas deliberadas.',
    useCases: ['Descanso entre tarefas com começo e fim', 'Alongar ou caminhar', 'Flashcards ou revisão leve', 'Respirar, organizar pensamento e voltar'],
    mindset: 'Recupere seu foco.',
    benefitLead: 'Pausas com estrutura evitam que o descanso vire navegação infinita.',
    benefits: [
      { title: 'Recuperação ativa', text: 'Combina recuperação física ou mental sem perder referência da agenda.' },
      { title: 'Transição útil', text: 'Ótimo após trabalho pesado antes de iniciar algo novo.' },
      { title: 'Pré-Pomodoro', text: 'Use como porta de entrada para blocos de 25–30 min depois.' },
    ],
    howSteps: [
      { n: 1, title: 'Escolha o tipo de pausa', text: 'Social, física ou microestudo — não misture três coisas ao mesmo tempo.' },
      { n: 2, title: 'Programe +10 min', text: 'Confira o horário na tela e o rótulo do alarme.' },
      { n: 3, title: 'Reduza estímulos', text: 'Se for descanso, evite conteúdo infinito que estoura o tempo.' },
      { n: 4, title: 'Volte com intenção', text: 'Ao tocar, abra o próximo bloco ou use a sugestão de progressão abaixo.' },
    ],
    seoDescription:
      'Despertador de 10 minutos online grátis: pausas guiadas, intervalos entre tarefas e revisão leve. Simples e no navegador.',
    progressionTargets: prog(15, 30, 45),
  },

  15: {
    title: 'Despertador de 15 minutos',
    subtitle: 'Avance sem perder o ritmo',
    description:
      'Um quarto de hora é perfeito para progresso visível em estudo ou trabalho sem exigir a disciplina de meia hora inteira.',
    useCases: ['Revisar conteúdo ou anotações', 'Organizar ideias em tópicos', 'Planejar próximos passos do dia', 'Tarefas administrativas concentradas'],
    mindset: 'Pequenos avanços constroem resultados.',
    benefitLead: 'Combina com variações curtas de Pomodoro e com cozinha ou rotinas domésticas.',
    benefits: [
      { title: 'Progresso mensurável', text: 'Dá para fechar um tópico ou um lote de e-mails com clareza.' },
      { title: 'Foco leve', text: 'Menos intimidador que 30 min; mais sustentável que só 5.' },
      { title: 'Encaixe no calendário', text: 'Encaixa entre compromissos sem “furar” a agenda inteira.' },
    ],
    howSteps: [
      { n: 1, title: 'Defina o entregável', text: 'Ex.: “resumo de uma página” ou “fila de e-mails zerada para X”.' },
      { n: 2, title: 'Some 15 min ao agora', text: 'Atalhos +5/+10 ou horário manual — o que for mais rápido.' },
      { n: 3, title: 'Um tab principal', text: 'Reduz troca de contexto até o bip.' },
      { n: 4, title: 'Feche com uma linha', text: 'Anote o próximo passo para não perder o ganho psicológico.' },
    ],
    seoDescription:
      'Despertador de 15 minutos online grátis: revisões, planejamento e foco leve. Alarme no navegador, volume ajustável.',
    progressionTargets: prog(30, 45, 60),
  },

  30: {
    title: 'Despertador de 30 minutos',
    subtitle: 'Foco estruturado',
    description:
      'Meia hora é o bloco clássico para estudo profundo, escrita ou análise. Você entra na tarefa e ainda tem margem para ajustes no fim.',
    useCases: ['Estudo estruturado ou leitura técnica', 'Trabalho focado sem interrupções', 'Sessões de escrita ou programação inicial', 'Provas rápidas com tempo limitado'],
    mindset: 'Entre no modo foco.',
    benefitLead: 'Tempo suficiente para superar a resistência inicial e gerar resultado tangível.',
    benefits: [
      { title: 'Profundidade real', text: 'Dá para atravessar o “vale da distração” dos primeiros minutos.' },
      { title: 'Metas claras', text: 'Combine com técnica de objetivo único até o alarme disparar.' },
      { title: 'Base para sequências', text: 'Após uma pausa, encadeie outro 30 ou salte para 45 min.' },
    ],
    howSteps: [
      { n: 1, title: 'Escreva o resultado pronto', text: 'Uma frase no topo: o que estará feito em 30 minutos?' },
      { n: 2, title: 'Armazene +30 min ou horário', text: 'Confirme rótulo (matéria, projeto) para lembrar o contexto.' },
      { n: 3, title: 'Silencie o ambiente', text: 'Notificações fora; música só se não roubar atenção verbal.' },
      { n: 4, title: 'Check de meio bloqueio', text: 'Por volta do meio, reavalie: escopo realista ou precisa cortar?' },
    ],
    seoDescription:
      'Despertador de 30 minutos online grátis: blocos de estudo e trabalho focado. Alarme confiável no navegador.',
    progressionTargets: prog(45, 60, 10),
  },

  45: {
    title: 'Despertador de 45 minutos',
    subtitle: 'Entre no fluxo',
    description:
      'Quarenta e cinco minutos sustentam aulas gravadas, reuniões longas solo ou projetos onde trinta parece pouco.',
    useCases: ['Assistir ou produzir com continuidade', 'Treinos mentais prolongados', 'Projetos com setup já feito', 'Blocos antes de uma pausa longa de verdade'],
    mindset: 'Fluxo contínuo de produtividade.',
    benefitLead: 'Ideal quando você já confia na capacidade de manter atenção além da meia hora.',
    benefits: [
      { title: 'Menos churn de contexto', text: 'Reduz tempo perdido ligando e desligando tarefas de alto custo cognitivo.' },
      { title: 'Curva de foco', text: 'Ponto entre 30 e 60 min para quem treina resistência gradual.' },
      { title: 'Compatível com pausas 15', text: 'Combine 45 + 15 como variação de ritmo de estudo.' },
    ],
    howSteps: [
      { n: 1, title: 'Prepare o corpo', text: 'Água e necessidades básicas antes do start — corta desculpas no meio.' },
      { n: 2, title: 'Um artefato de saída', text: 'Slides, texto, questões: escolha um entregável verificável.' },
      { n: 3, title: 'Volume e aba', text: 'Teste o som; mantenha a sessão onde o navegador pode notificar.' },
      { n: 4, title: 'Variância quando cansar', text: 'Alterne formato da tarefa (ler ↔ resumir) em vez de parar antes do bip.' },
    ],
    seoDescription:
      'Despertador de 45 minutos online grátis: blocos longos de concentração e estudo pesado sem instalar programa.',
    progressionTargets: prog(60, 30, 15),
  },

  60: {
    title: 'Despertador de 60 minutos',
    subtitle: 'Produtividade profunda',
    description:
      'Uma hora inteira pede combinado prévio com sono, agenda e objetivo — ideal para trabalho profundo quando interrupções estão sob controle.',
    useCases: ['Deep work com meta clara ao fim', 'Projetos importantes ou capítulos longos', 'Sessões longas de estudo com dois subciclos internos', 'Rotinas que naturalmente ocupam uma hora (ex.: simulados)'],
    mindset: 'Foque sem interrupções.',
    benefitLead: 'Use quando já domina alarmes curtos — profundidade exige hábito, não só boa intenção.',
    benefits: [
      { title: 'Continuidade', text: 'Protege espaço contra reuniões e mensagens dispersas durante o período combinado.' },
      { title: 'Dois atos internos', text: 'Divida mentalmente ~25 min criação + ~35 refinamento dentro da hora.' },
      { title: 'Valor após pausa séria', text: 'Feche com pausa marcada-outro alarme menor — evita burnout.' },
    ],
    howSteps: [
      { n: 1, title: 'Compromisso explícito', text: 'Anote por que esta hora importa mais que o resto do dia.' },
      { n: 2, title: 'Elimine dívidas pequenas', text: 'Café, banheiro, mensagens triviais antes do start.' },
      { n: 3, title: 'Um canal de entrada', text: 'Documento, IDE ou livro aberto antes do timer verbalizar “já”.' },
      { n: 4, title: 'Pausa obrigatória depois', text: 'Ao tocar: levante antes de iniciar próxima hora — corrige rigidez.' },
    ],
    seoDescription:
      'Despertador de 60 minutos online grátis: blocos profundos, estudo demorado e simulados. Alarme pelo navegador.',
    progressionTargets: prog(30, 10, 5),
  },
};

export function isTimerPageMinutes(value: number): value is TimerPageMinutes {
  return (TIMER_PAGE_MINUTES as readonly number[]).includes(value);
}

export function buildTimerPageMetadata(minutes: TimerPageMinutes): Metadata {
  const title = `Despertador de ${minutes} minutos online grátis`;
  const description = `Use um despertador de ${minutes} minutos para foco, pausas e produtividade.`;
  const canonical = `${SITE_URL}${timerPagePath(minutes)}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Relógio Despertador',
    },
    twitter: { card: 'summary', title, description },
  };
}
