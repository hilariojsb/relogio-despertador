/**
 * Páginas programáticas SEO: /despertador/[slug]
 * Slugs curtos e amigáveis; metadados otimizados; artigo longo (200–400 palavras nas URLs principais).
 */

import { SITE_URL } from '@/lib/constants/site';
import type { SeoArticle } from '@/lib/seo/types';
import {
  ARTICLE_10_MIN,
  ARTICLE_5_MIN,
  ARTICLE_ALTO,
  ARTICLE_PARA_ESTUDAR,
  buildMinuteArticle,
} from '@/lib/seo/despertador-articles';

export interface DespertadorSeoVariant {
  /** URL: /despertador/{slug} */
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  /** Resumo curto no hero (1–3 frases) */
  intro: string;
  /** Artigo para indexação (200–400 palavras nas páginas foco) */
  seoArticle: SeoArticle;
  howToTitle: string;
  howToItems: string[];
  /** Frase curta opcional entre ferramenta e artigo */
  extraParagraph?: string;
}

const SITE = SITE_URL;

const DIRECT_SHORTCUT_MINUTES = new Set([5, 10, 30]);

function minuteVariant(minutes: number): DespertadorSeoVariant {
  const hasShortcut = DIRECT_SHORTCUT_MINUTES.has(minutes);
  const slug = `${minutes}-minutos`;

  const intro = hasShortcut
    ? `Use o atalho +${minutes} min para alarme daqui a ${minutes} minutos, sem digitar o horário. Ajuste o volume conforme o ambiente.`
    : `Para alarme daqui a ${minutes} minutos, use o campo de horário ou combine +5, +10 e +30 até totalizar o tempo desejado.`;

  const firstStep = hasShortcut
    ? `Toque em +${minutes} min para somar ${minutes} minutos ao horário atual.`
    : `Defina ${minutes} minutos no relógio ou combine atalhos (+5, +10, +30) até somar ${minutes} minutos.`;

  const seoArticle =
    minutes === 5
      ? ARTICLE_5_MIN
      : minutes === 10
        ? ARTICLE_10_MIN
        : buildMinuteArticle(minutes, hasShortcut);

  return {
    slug,
    metaTitle:
      minutes <= 10
        ? `Despertador ${minutes} minutos | Alarme online grátis — Relógio Despertador Online`
        : `Despertador ${minutes} min — alarme no navegador | Relógio Despertador Online`,
    metaDescription:
      minutes <= 10
        ? `Despertador de ${minutes} minutos online: atalho rápido, som ajustável, sem instalar app. Ideal para pausas, estudo e lembretes no PC ou celular.`
        : `Configure alarme de ${minutes} minutos no navegador. Relógio Despertador: leve, com volume configurável e lista de horários. Funciona sem instalação.`,
    keywords: [
      `despertador ${minutes} minutos`,
      `alarme ${minutes} minutos`,
      'despertador online',
      'alarme navegador',
    ],
    eyebrow: 'Alarme rápido',
    h1: `Despertador ${minutes} minutos`,
    intro,
    seoArticle,
    howToTitle: `Como usar o despertador de ${minutes} minutos`,
    howToItems: [
      firstStep,
      'Opcionalmente adicione um rótulo (ex.: pausa, estudo, remédio).',
      'Confirme com o botão de adicionar e mantenha a aba aberta.',
      'Quando tocar, use Parar alarme para silenciar.',
    ],
    extraParagraph:
      minutes <= 10
        ? 'Ótimo para pausas curtas, alongamentos e lembretes rápidos no dia a dia.'
        : 'Indicado para blocos de foco, cozimento e intervalos entre tarefas.',
  };
}

/** Páginas editoriais fixas — URLs curtas */
const MANUAL_VARIANTS: DespertadorSeoVariant[] = [
  {
    slug: 'para-estudar',
    metaTitle: 'Despertador para estudar — alarmes e foco online | Relógio Despertador Online',
    metaDescription:
      'Despertador para estudar no navegador: organize blocos de estudo, pausas e revisões. Som ajustável, vários alarmes e dados salvos localmente.',
    keywords: [
      'despertador para estudar',
      'alarme estudo',
      'estudar com timer',
      'despertador online estudos',
    ],
    eyebrow: 'Estudos e foco',
    h1: 'Despertador para estudar',
    intro:
      'Programe alarmes para começar e terminar blocos de estudo, alternar matérias e lembrar pausas. Tudo no navegador, com volume sob controle.',
    seoArticle: ARTICLE_PARA_ESTUDAR,
    howToTitle: 'Como usar o despertador na rotina de estudos',
    howToItems: [
      'Defina horários fixos (ex.: início da manhã) ou use +5, +10, +30 min para blocos relativos.',
      'Nomeie alarmes por matéria ou tipo de tarefa (leitura, questões, revisão).',
      'Mantenha a aba aberta para o som tocar no horário.',
      'Ajuste o volume para o seu ambiente (biblioteca, casa, coworking).',
      'Silencie com Parar alarme ao concluir o bloco.',
    ],
  },
  {
    slug: 'alto',
    metaTitle: 'Despertador alto — volume forte do alarme online | Relógio Despertador Online',
    metaDescription:
      'Despertador alto no PC: aumente o volume do alarme no navegador. Controle deslizante, testes rápidos e alertas audíveis em ambientes barulhentos.',
    keywords: ['despertador alto', 'alarme alto', 'volume alarme', 'som alto despertador'],
    eyebrow: 'Som audível',
    h1: 'Despertador alto',
    intro:
      'Suba o volume do alarme com o controle ao lado do alto-falante. Ideal quando você precisa ouvir o alerta de longe ou em ambientes com ruído.',
    seoArticle: ARTICLE_ALTO,
    howToTitle: 'Como aumentar o volume do despertador',
    howToItems: [
      'Localize o controle de volume na área de alarmes.',
      'Arraste para a direita para aumentar o nível do bip.',
      'Faça um teste com alarme em um ou dois minutos.',
      'Verifique o volume do sistema operacional e se o áudio não está mudo.',
      'Use Parar alarme para encerrar o som ao disparar.',
    ],
  },
  {
    slug: 'online-gratis',
    metaTitle: 'Despertador online grátis — alarmes no navegador | Relógio Despertador Online',
    metaDescription:
      'Despertador online grátis: vários alarmes, som ajustável, sem instalar app. Dados no seu dispositivo. Chrome, Edge, Firefox e outros navegadores.',
    keywords: ['despertador online grátis', 'alarme grátis', 'despertador navegador', 'alarme online'],
    eyebrow: 'Sem custo',
    h1: 'Despertador online grátis',
    intro:
      'Crie alarmes ilimitados no navegador sem pagar e sem baixar programa. Configurações armazenadas localmente para uso rápido no dia a dia.',
    seoArticle: {
      sections: [
        {
          heading: 'Por usar um despertador online gratuito',
          paragraphs: [
            'Ferramentas no navegador reduzem atrito: não ocupam espaço na loja de apps, atualizam com o site e funcionam em Windows, macOS ou Linux desde que o navegador seja moderno. Para quem só precisa de alarmes pontuais ou de uma lista de horários no computador, essa abordagem costuma ser a mais direta.',
            'O Relógio Despertador foi pensado para carregar rápido e mostrar o essencial: relógio atual, atalhos de minutos e lista de alarmes. O modelo gratuito cobre o uso típico de lembretes pessoais, estudo e trabalho, sem obrigar cadastro para experimentar a funcionalidade principal.',
          ],
        },
        {
          heading: 'Privacidade e armazenamento local',
          paragraphs: [
            'As configurações ficam no seu navegador (storage local), o que mantém os horários disponíveis offline na prática cotidiana e evita depender de rede para consultar a lista. Isso também significa que limpar dados do site remove os alarmes salvos — um comportamento esperado e transparente.',
          ],
        },
        {
          heading: 'Quando o alarme toca',
          paragraphs: [
            'Mantenha a aba aberta no momento do disparo e permita áudio na página se o navegador solicitar. Ajuste o volume do alarme conforme o ambiente e use o botão de parar para silenciar imediatamente. Esses cuidados melhoram a confiabilidade do alerta e a experiência em uso contínuo.',
          ],
        },
      ],
    },
    howToTitle: 'Como usar o despertador grátis',
    howToItems: [
      'Escolha horário exato ou atalhos +5, +10, +30 minutos.',
      'Adicione rótulos para identificar cada alarme.',
      'Mantenha a aba aberta no horário do disparo.',
      'Ajuste o volume na barra do alto-falante.',
      'Toque em Parar alarme para silenciar.',
    ],
    extraParagraph:
      'Ideal para quem busca simplicidade: abrir, configurar e receber o alerta sem passos extras.',
  },
  {
    slug: 'navegador',
    metaTitle: 'Despertador no navegador — Chrome, Edge, Firefox | Relógio Despertador Online',
    metaDescription:
      'Despertador no navegador para qualquer sistema: alarmes com som, atalhos de minutos e lista de horários. Sem instalar aplicativo nativo.',
    keywords: ['despertador navegador', 'alarme chrome', 'despertador online pc', 'alarme edge'],
    eyebrow: 'Qualquer desktop',
    h1: 'Despertador no navegador',
    intro:
      'Use Chrome, Edge, Firefox ou outro navegador atual. Configure horários e receba o alarme enquanto a aba estiver aberta e com permissão de áudio.',
    seoArticle: {
      sections: [
        {
          heading: 'Vantagens de um alarme baseado no navegador',
          paragraphs: [
            'Centralizar lembretes no navegador ajuda quem já trabalha com abas o dia inteiro. Você evita alternar para o celular ou abrir outro aplicativo só para criar um alarme rápido. Em notebooks corporativos com restrições de instalação, sites leves costumam ser a alternativa viável.',
            'O Relógio Despertador prioriza HTML estático e componentes enxutos para abrir em segundos, o que melhora a experiência e reduz abandono — importante para ferramentas que dependem de hábito diário.',
          ],
        },
        {
          heading: 'Permissões e comportamento do áudio',
          paragraphs: [
            'Navegadores podem bloquear som até que haja interação com a página. Um clique na área do despertador costuma liberar o áudio nas próximas visitas. Se o alarme não tocar, verifique o ícone de permissões na barra de endereço e o volume do sistema.',
          ],
        },
        {
          heading: 'Rotina recomendada',
          paragraphs: [
            'Fixe a aba ou mantenha-a visível no horário programado. Combine alarmes nomeados com atalhos de minutos para criar sequências sem redigir horários manualmente. Com isso, o despertador no navegador vira um apoio constante, não um recurso esporádico.',
          ],
        },
      ],
    },
    howToTitle: 'Checklist do despertador no navegador',
    howToItems: [
      'Adicione alarmes por horário ou atalhos de minutos.',
      'Deixe a aba aberta no disparo e permita áudio.',
      'Ajuste o volume do alarme ao ambiente.',
      'Silencie com Parar alarme após o alerta.',
    ],
  },
];

const MINUTE_PRESETS = [5, 10, 15, 30, 45, 60] as const;

export const DESPERTADOR_SEO_VARIANTS: DespertadorSeoVariant[] = [
  ...MINUTE_PRESETS.map(m => minuteVariant(m)),
  ...MANUAL_VARIANTS,
];

const bySlug = new Map(DESPERTADOR_SEO_VARIANTS.map(v => [v.slug, v]));

export function getDespertadorSeoBySlug(slug: string): DespertadorSeoVariant | undefined {
  return bySlug.get(slug);
}

export function getAllDespertadorSeoSlugs(): string[] {
  return DESPERTADOR_SEO_VARIANTS.map(v => v.slug);
}

export function buildDespertadorCanonical(slug: string): string {
  return `${SITE}/despertador/${slug}`;
}
