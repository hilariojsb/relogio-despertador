"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Clock, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/** Paleta alinhada ao mock (fundos e destaques) */
const TEXT = "#333333";
const TEXT_SEC = "#555555";
const BORDER = "#E0E0E0";
const OUTER_BG = "#F9FBFF";
const INNER_CARD_BG = "#FFFFFF";
const SECTION_SOFT = "#FFFFFF";
const BLUE = "#2B5AED";
const BADGE_BLUE_BG = "#E8F0FE";
const QUOTE_CARD_BG = "#E8F5E9";
const QUOTE_CARD_BORDER = "#C8E6C9";
const QUOTE_TEXT = "#2E7D32";
const QUOTE_ICON = "#2E7D32";
const ICON_MUTED = "#757575";

const TOPIC_IDS = [
  "pomodoro-guia-tema-1",
  "pomodoro-guia-tema-2",
  "pomodoro-guia-tema-3",
  "pomodoro-guia-tema-4",
  "pomodoro-guia-tema-5",
  "pomodoro-guia-tema-6",
] as const;

const TOPIC_TITLES = [
  "O que é a Técnica Pomodoro?",
  "Como aplicar corretamente",
  "Erros comuns",
  "Funciona para todo mundo?",
  "Variações da técnica",
  "Dicas avançadas",
] as const;

const TOPIC_HEADINGS = TOPIC_TITLES.map(
  (t, i) => `${i + 1}. ${t}`,
) as string[];

const SECTION_HEADING_ID = "pomodoro-guia-completo";

const PANEL_TRANSITION_MS = 280;

export function PomodoroGuiaSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const navId = "pomodoro-guia-navegacao";

  useEffect(() => {
    setDetailsExpanded(false);
  }, [activeIndex]);

  return (
    <section className="py-10" aria-labelledby={SECTION_HEADING_ID}>
      <div
        className="overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-7 md:p-8"
        style={{
          backgroundColor: OUTER_BG,
          borderColor: BORDER,
          boxShadow:
            "0 1px 2px rgba(51,51,51,0.06), 0 10px 30px -8px rgba(51,51,51,0.08)",
        }}
      >
        <h2
          id={SECTION_HEADING_ID}
          className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          style={{ color: TEXT }}
        >
          Guia completo da Técnica Pomodoro
        </h2>

        <div
          className={cn(
            "mt-6 grid border-t border-[#E0E0E0] pt-6 sm:mt-7 sm:pt-7 md:mt-8 md:pt-8",
            "grid-cols-1 items-start gap-6",
            "md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]",
            "xl:grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,280px)]",
          )}
        >
          <nav
            className="order-1 w-full min-w-0 max-w-full md:sticky md:top-[100px] md:self-start"
            id={navId}
            aria-label="Navegação do guia Pomodoro"
          >
            <div
              className="rounded-3xl border p-4 shadow-sm sm:p-5 md:border-b-0"
              style={{ borderColor: BORDER, backgroundColor: INNER_CARD_BG }}
            >
              {/* Mobile: menu horizontal */}
              <ul className="-mx-1 flex list-none gap-1 overflow-x-auto pb-1 md:hidden">
                {TOPIC_TITLES.map((title, i) => (
                  <li key={TOPIC_IDS[i]} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-controls={TOPIC_IDS[i]}
                      aria-selected={activeIndex === i}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-2 text-left text-xs font-medium leading-snug transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                      activeIndex === i
                        ? "shadow-sm"
                        : "hover:bg-[rgba(43,90,237,0.06)]",
                    )}
                    style={
                      activeIndex === i
                        ? {
                            backgroundColor: BADGE_BLUE_BG,
                            color: BLUE,
                            fontWeight: 600,
                          }
                        : { color: TEXT, fontWeight: 500 }
                    }
                    >
                      {i + 1}. {title}
                    </button>
                  </li>
                ))}
              </ul>
              {/* Desktop: menu vertical */}
              <ol
                className="hidden divide-y divide-[#E0E0E0] md:block"
                role="list"
              >
                {TOPIC_TITLES.map((title, i) => (
                  <li key={TOPIC_IDS[i]}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-controls={TOPIC_IDS[i]}
                      aria-selected={activeIndex === i}
                      className={cn(
                        "w-full py-3.5 pl-0 pr-1 text-left text-sm leading-snug transition-colors sm:text-[15px]",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                        activeIndex === i
                          ? "my-0.5 rounded-lg px-2"
                          : "hover:bg-[rgba(43,90,237,0.06)]",
                      )}
                      style={
                        activeIndex === i
                          ? {
                              backgroundColor: BADGE_BLUE_BG,
                              color: BLUE,
                              fontWeight: 600,
                            }
                          : { color: TEXT, fontWeight: 500 }
                      }
                      aria-current={activeIndex === i ? "true" : undefined}
                    >
                      {i + 1}. {title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="order-2 w-full min-w-0">
            <div
              className="relative w-full max-w-[680px]"
              role="tabpanel"
              aria-live="polite"
            >
              {/* Painel 0 */}
              <article
                id={TOPIC_IDS[0]}
                aria-labelledby={`${TOPIC_IDS[0]}-title`}
                aria-hidden={activeIndex !== 0}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 0
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[0]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[0]}
                </h3>
                <div
                  className="mt-4 space-y-3 text-sm leading-7 md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <p>
                    Método de gestão do tempo com blocos de foco e pausas
                    curtas (e uma pausa longa a cada série). O nome vem do
                    cronómetro em forma de tomate: delimita o trabalho e
                    ajuda a comprometer com uma tarefa de cada vez.
                  </p>
                  <p>
                    Na forma clássica cada bloco tem 25 minutos; o essencial é
                    definir o que fazer antes de começar, manter foco durante o
                    alarme e usar a pausa para recuperar, não para outra tarefa
                    pesada.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[0]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[0]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-4 space-y-4 border-t border-[#E0E0E0] pt-4 text-sm leading-7 md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <p>
                        A Técnica Pomodoro é um método de gestão do tempo em que
                        você trabalha com intervalos de foco, separados por
                        pausas curtas e, ao final de um conjunto de ciclos, por
                        uma pausa longa. O nome remete ao tradicional relógio de
                        cozinha em formato de tomate — o cronômetro visual ajuda
                        a delimitar o bloco e a comprometer com uma única
                        tarefa.
                      </p>
                      <p>
                        Cada &quot;Pomodoro&quot; (bloco) é, na forma clássica,
                        de 25 minutos, mas o princípio é o de concentrar a
                        atenção de forma intencional: antes de começar, escolhe
                        o que vai fazer; durante o foco, evita trocar de tarefa;
                        na pausa, desliga de telas e tarefas cognitivas
                        pesadas, para o cérebro recuperar.
                      </p>
                      <p>
                        A técnica serve tanto para tarefas de estudo e trabalho
                        profundo como para decompor projetos em passos
                        concretos, tornando a procrastinação mais difícil e a
                        progressão mais mensurável.
                      </p>
                      <h4
                        className="pt-2 text-base font-bold md:text-lg"
                        style={{ color: TEXT }}
                      >
                        Por que funciona?
                      </h4>
                      <div className="space-y-3">
                        <p>
                          A mente cansa de manter atenção sustentada sem pausas.
                          Blocos com tempo claro aproveitam o ritmo de alerta e
                          repouso, aproximando-se do que a pesquisa em atenção
                          e fadiga mental sugere: trabalhar com intensidade,
                          depois reabastecer com pausas reais, não com novas
                          exigências cognitivas.
                        </p>
                        <p>
                          O ato de anotar o que concluiu e o que fica para o
                          próximo bloco — um hábito recomendado em muitas
                          adaptações do método — reforça a clareza e a sensação
                          de progresso, que por sua vez sustenta a motivação a
                          médio prazo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Painel 1 */}
              <article
                id={TOPIC_IDS[1]}
                aria-labelledby={`${TOPIC_IDS[1]}-title`}
                aria-hidden={activeIndex !== 1}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 1
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[1]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[1]}
                </h3>
                <div
                  className="mt-4 space-y-3 text-sm leading-7 md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <p>
                    Escreva a tarefa do próximo bloco; se for grande, divida em
                    passos concluíveis. Quando o temporizador começa, fica só
                    nessa tarefa até ao alarme.
                  </p>
                  <p>
                    Pausa curta: mexa no corpo e na vista. Pausa longa: saia do
                    contexto de trabalho antes da próxima ronda. Ajuste tempos
                    ao seu dia, mantendo foco intenso e pausas reais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[1]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[1]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-4 space-y-4 border-t border-[#E0E0E0] pt-4 text-sm leading-7 md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <p>
                        Comece por definir, por escrito, a tarefa do próximo
                        bloco. Se for demasiado grande, divida em unidades
                        concluíveis (por exemplo, &quot;escrever a
                        introdução&quot; em vez de &quot;acabar o relatório&quot;).
                        Quando o temporizador arranca, fica nessa tarefa até o
                        alarme. Notificações e outras tarefas ficam fora, na
                        medida do possível.
                      </p>
                      <p>
                        A pausa curta é para o corpo e a vista — levante-se,
                        beba água, abra a janela. Evite, na medida de
                        viabilidade, redes sociais, que roubam os vinte e cinco
                        minutos seguintes. Após a série de ciclos focais
                        completos, use a pausa longa para sair de todo do
                        contexto de trabalho alguns minutos, antes de uma nova
                        ronda.
                      </p>
                      <p>
                        Ajuste tempos (foco, pausas, número de ciclos) ao seu
                        contexto: reuniões, crianças em casa e prazos apertados
                        pedem durações diferentes, desde que o princípio (foco
                        intenso, pausas reais) se mantenha.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Painel 2 */}
              <article
                id={TOPIC_IDS[2]}
                aria-labelledby={`${TOPIC_IDS[2]}-title`}
                aria-hidden={activeIndex !== 2}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 2
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[2]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[2]}
                </h3>
                <ul
                  className="mt-4 list-inside list-disc space-y-2 text-sm leading-7 marker:text-[#9E9E9E] md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <li>
                    <strong style={{ color: TEXT }}>Saltar pausas</strong> —
                    cansaço acumula e anula o método.
                  </li>
                  <li>
                    <strong style={{ color: TEXT }}>Multitarefa</strong> e{" "}
                    <strong style={{ color: TEXT }}>pausas falsas</strong> (nova
                    tarefa mental na &quot;pausa&quot;).
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[2]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[2]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <ul
                      className="mt-4 list-inside list-disc space-y-3 border-t border-[#E0E0E0] pt-4 text-sm leading-7 marker:text-[#9E9E9E] md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <li>
                        <strong style={{ color: TEXT }}>Ignorar as pausas</strong>{" "}
                        para &quot;ganhar mais tempo&quot; — o cansaço acumula e a
                        qualidade cai, anulando o efeito do método.
                      </li>
                      <li>
                        <strong style={{ color: TEXT }}>Multitarefa</strong> no
                        mesmo bloco, saltando entre e-mails, redes e tarefa
                        principal.
                      </li>
                      <li>
                        <strong style={{ color: TEXT }}>Pausas a fingir</strong>:
                        trocar de tarefa mentalmente sem sair da tela ou fazer
                        outra coisa exigente.
                      </li>
                      <li>
                        <strong style={{ color: TEXT }}>Blocos sem definição</strong>
                        : começar o temporizador sem saber o que
                        &quot;feito&quot; significa nesse bloco.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* Painel 3 */}
              <article
                id={TOPIC_IDS[3]}
                aria-labelledby={`${TOPIC_IDS[3]}-title`}
                aria-hidden={activeIndex !== 3}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 3
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[3]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[3]}
                </h3>
                <div
                  className="mt-4 space-y-3 text-sm leading-7 md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <p>
                    Não há método universal: a técnica favorece quem ganha com
                    estrutura e limites de tempo. Quem tem interrupções
                    constantes ou ciclos de atenção muito curtos pode precisar
                    de adaptações fortes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[3]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[3]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-4 space-y-4 border-t border-[#E0E0E0] pt-4 text-sm leading-7 md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <p>
                        Não existe método universal. A Técnica Pomodoro é
                        desenhada para a maioria que se beneficia de estrutura e
                        de limites de tempo, mas pessoas com necessidades muito
                        particulares (por exemplo, interrupções constantes
                        inadiáveis, ou padrões de atenção que exigem ciclos
                        muito mais curtos) podem ter de adaptar fortemente a
                        duração e as regras.
                      </p>
                      <p>
                        Se, após algumas semanas, sentir piora de stress ou
                        esgotamento, ajuste os tempos, o número de ciclos ou
                        consulte recursos de saúde mental e ergonomia. O guia
                        aplica-se melhor a quem consegue reservar janelas
                        mínimas de concentração, mesmo em casas barulhentas,
                        usando auscultadores ou sinais com colegas e familiares.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Painel 4 */}
              <article
                id={TOPIC_IDS[4]}
                aria-labelledby={`${TOPIC_IDS[4]}-title`}
                aria-hidden={activeIndex !== 4}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 4
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[4]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[4]}
                </h3>
                <div
                  className="mt-4 space-y-3 text-sm leading-7 md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <p>
                    O clássico é 25/5/15 minutos; muita gente usa 50/10 ou
                    90/15 em trabalho profundo, ou 15 min para começar com
                    menos fricção.
                  </p>
                  <p>
                    O que importa:{" "}
                    <strong style={{ color: TEXT }}>
                      bloco claro, pausas reais e rever o próximo passo
                    </strong>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[4]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[4]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-4 space-y-4 border-t border-[#E0E0E0] pt-4 text-sm leading-7 md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <p>
                        A forma clássica usa 25/5/15 minutos, mas muita gente
                        aplica 50/10 ou 90/15 em tarefas que exigem
                        &quot;arranque&quot; longo, como programação ou
                        redação. Outras pessoas preferem 15 minutos de foco para
                        começar o hábito com menos fricção.
                      </p>
                      <p>
                        O núcleo que se mantém é:{" "}
                        <strong style={{ color: TEXT }}>
                          bloco de trabalho nítido, pausas reais, revisão do que
                          fazer a seguir
                        </strong>
                        . A sua ferramenta (cronómetro, app ou esta página)
                        deve só tornar isso fácil de repetir, sem acrescentar
                        complexidade inútil.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Painel 5 */}
              <article
                id={TOPIC_IDS[5]}
                aria-labelledby={`${TOPIC_IDS[5]}-title`}
                aria-hidden={activeIndex !== 5}
                className={cn(
                  "transition-[opacity,visibility] ease-out",
                  activeIndex === 5
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none invisible absolute left-0 right-0 top-0 z-0 opacity-0",
                )}
                style={{
                  transitionDuration: `${PANEL_TRANSITION_MS}ms`,
                }}
              >
                <h3
                  id={`${TOPIC_IDS[5]}-title`}
                  className="text-xl font-bold leading-snug md:text-2xl"
                  style={{ color: TEXT }}
                >
                  {TOPIC_HEADINGS[5]}
                </h3>
                <div
                  className="mt-4 space-y-3 text-sm leading-7 md:text-base"
                  style={{ color: TEXT_SEC }}
                >
                  <p>
                    <strong style={{ color: TEXT }}>Revise ao fim do dia</strong>{" "}
                    quantos ciclos fez e o que bloqueou. Combine com poucas
                    prioridades reais para não confundir movimento com
                    progresso.
                  </p>
                  <p>
                    Ideias extra: anote para depois; em equipa, avise quando
                    estiver em modo foco.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailsExpanded((e) => !e)}
                  className={cn(
                    "mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/60",
                  )}
                  style={{ color: BLUE }}
                  aria-expanded={detailsExpanded}
                  aria-controls={`${TOPIC_IDS[5]}-full`}
                >
                  {detailsExpanded ? "Ver menos" : "Ver mais"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      detailsExpanded && "rotate-180",
                    )}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
                <div
                  id={`${TOPIC_IDS[5]}-full`}
                  className={cn(
                    "grid transition-[grid-template-rows] ease-out",
                    detailsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                  style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className="mt-4 space-y-4 border-t border-[#E0E0E0] pt-4 text-sm leading-7 md:text-base"
                      style={{ color: TEXT_SEC }}
                    >
                      <p>
                        <strong style={{ color: TEXT }}>Revise ao fim do dia</strong>{" "}
                        quantos ciclos completou e o que bloqueou — padrões
                        surgem cedo. <strong style={{ color: TEXT }}>Combine</strong>{" "}
                        a técnica com listas mínimas (hoje, no máximo, três
                        prioridades reais) para evitar a sensação falsa de
                        produtividade.
                      </p>
                      <p>
                        <strong style={{ color: TEXT }}>
                          Resistência às distrações
                        </strong>
                        : se surgir ideia, anote noutro bloco, não mude de
                        tarefa. Em equipas, avise com antecedência o modo
                        &quot;foco&quot; para reduzir notificações de chat.
                      </p>
                      <p>
                        Por fim, reavalie a cada mês: se os tempos padrão já não
                        servem, mude. O método acompanha a vida, e não o
                        contrário.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <aside
            className={cn(
              "order-3 flex w-full min-w-0 max-w-full flex-col gap-5",
              "border-t border-[#E0E0E0] pt-6 sm:gap-6",
              "md:col-span-2 md:row-start-2 md:gap-5 md:border-t md:border-[#E0E0E0] md:pt-6",
              "xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:sticky xl:top-[100px] xl:self-start",
              "xl:border-t-0 xl:pt-0",
            )}
          >
            <div
              className="rounded-3xl border p-4 shadow-sm sm:p-5"
              style={{
                borderColor: BORDER,
                backgroundColor: SECTION_SOFT,
              }}
            >
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: TEXT }}
              >
                Em resumo
              </p>
              <ul
                className="mt-4 space-y-3.5 text-sm leading-7"
                style={{ color: TEXT }}
              >
                <li className="flex items-start gap-2.5">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={2}
                    style={{ color: ICON_MUTED }}
                    aria-hidden
                  />
                  <span>25 min de foco total</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={2}
                    style={{ color: ICON_MUTED }}
                    aria-hidden
                  />
                  <span>5 min de pausa curta</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={2}
                    style={{ color: ICON_MUTED }}
                    aria-hidden
                  />
                  <span>Após 4 ciclos, pausa longa (15 a 30 min)</span>
                </li>
              </ul>
            </div>

            <figure
              className="rounded-3xl border p-4 shadow-sm sm:p-5"
              style={{
                borderColor: QUOTE_CARD_BORDER,
                backgroundColor: QUOTE_CARD_BG,
              }}
            >
              <Quote
                className="h-5 w-5"
                style={{ color: QUOTE_ICON }}
                strokeWidth={2}
                aria-hidden
              />
              <blockquote
                className="mt-3 text-sm font-medium leading-relaxed italic sm:text-base"
                style={{ color: QUOTE_TEXT }}
                cite="https://francescocirillo.com/"
              >
                <p>
                  &ldquo;Não é sobre fazer mais coisas, é sobre fazer as coisas
                  certas com foco total.&rdquo;
                </p>
              </blockquote>
              <figcaption
                className="mt-3 text-sm font-semibold not-italic"
                style={{ color: QUOTE_TEXT }}
              >
                — Francesco Cirillo
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>
    </section>
  );
}
