import { defineBlogArticle } from '@/lib/blog-articles/validate-blog-article';

export const articlePorQueProcrastinamos = defineBlogArticle({
  slug: 'por-que-procrastinamos',
  title: 'Por que você procrastina? Entenda o que está por trás da falta de ação',
  description:
    'Por que procrastinamos? Causas simples — medo, cansaço, tarefas confusas e sobrecarga — e como a psicologia explica a falta de ação (sem culpa).',
  tagline:
    'Saber o que fazer e não fazer costuma ser emoção ou cansaço no comando — não “falta de caráter”.',
  publishedAt: '2026-05-03',
  readMinutes: 12,
  category: 'Produtividade',
  tags: ['procrastinacao'],
  keywords: [
    'por que procrastinamos',
    'causas da procrastinação',
    'por que adiamos tarefas',
    'falta de motivação procrastinação',
    'psicologia da procrastinação',
    'procrastinação e emoções',
  ],
  quickSummary: [
    'Procrastinação não é preguiça: na maior parte das vezes é resposta a desconforto, cansaço ou tarefa mal definida.',
    'Emoções influenciam o comportamento mais do que parece — alívio rápido vence discurso sensato quando o corpo quer pausa.',
    'Tarefas difíceis ou confusas geram resistência; sem primeiro passo óbvio, a mente empurra para depois.',
    'Clareza reduz procrastinação: nomear o próximo movimento diminui negociação interna e abre espaço para começar.',
  ],
  heroImage: {
    src: 'https://res.cloudinary.com/dtqplznus/image/upload/v1777948104/porque-voce-procastina-pg-blog_c3dxi6.jpg',
    alt:
      'Metáfora visual de resistência à ação: figura avançando enquanto forças invisíveis puxam para trás.',
  },
  midArticleImage: {
    src:
      'https://res.cloudinary.com/dtqplznus/image/upload/v1778031096/Por_que_procrastinamos_causas_que_aparecem_todo_dia_pcdnin.jpg',
    alt:
      'Caminho de pedras para um arco luminoso distante; no percurso, um vórtice com a palavra procrastinação; letreiro bloqueio em primeiro plano e ação no horizonte.',
    afterSectionIndex: 1,
  },
  intro: [
    'Você já sabe exatamente o que precisa fazer. A prioridade está escrita, o prazo existe, o custo de adiar é claro — e mesmo assim o dia passa em micro escapadas: um vídeo, uma conversa, um “só organizar aqui”. À noite vem a frustração: não foi falta de informação, foi **falta de ação**. Essa sensação é mais comum do que parece, e entender **por que procrastinamos** ajuda a parar de confundir problema humano com falha pessoal.',
    'Este texto é uma explicação **simples**, sem jargão acadêmico: **causas da procrastinação**, o papel das emoções e do cansaço, e um caminho curto para **reduzir** o padrão — não para “virar outra pessoa da noite pro dia”. Para fechar o ciclo com passos objetivos, vale ler também **[como parar de procrastinar](/blog/como-parar-de-procrastinar)** depois deste.',
    'Vamos dividir em quatro movimentos: o que é procrastinação (rápido), **por que adiamos tarefas** em cinco frentes práticas, o **lado psicológico** em linguagem direta, como diminuir o problema no cotidiano, erros comuns, um protocolo **como aplicar hoje** e fechamento com ferramentas (**[Pomodoro](/pomodoro)**, **[temporizador](/temporizador)**, **[cronômetro](/cronometro)**) para transformar entendimento em ritmo.',
  ],
  sections: [
    {
      h2: 'O que é procrastinação (em poucas linhas)',
      paragraphs: [
        'Procrastinação é **adiar o que importa** em troca de **conforto imediato**. Esse conforto pode ser descanso real — mas, no padrão problemático, costuma ser só **distração barata**: scroll, limpar algo secundário, adiar com sensação de ocupação.',
        'Não é a mesma coisa que planejar com calma ou escolher uma ordem melhor de tarefas. Procrastinação deixa você **menos alinhado com seus próprios critérios**: você termina o dia cansado e, mesmo assim, com o peso do principal na mesa.',
      ],
    },
    {
      h2: 'Por que procrastinamos (causas que aparecem todo dia)',
      paragraphs: [
        'Se você se pergunta **por que procrastinamos** como espécie “que deveria saber melhor”, a resposta curta é: o cérebro é excelente em **proteger você do desconforto agora**, mesmo quando isso afrouxa o futuro. Eis cinco formatos muito comuns — quase sempre aparecem misturados:',
      ],
      subsections: [
        {
          h3: '1. Tarefas difíceis ou confusas',
          paragraphs: [
            'Quando o próximo passo é nebuloso (“melhorar o projeto”, “estudar”), a mente trata como **ameaça cognitiva**: muito esforço para pouca clareza de vitória. **Falta de clareza** vira desculpa silenciosa para não começar.',
            'Nesses casos procrastinar não é “preguiça”; é **evitar entrar num labirinto**. A saída honesta é cortar a tarefa até virar um verbo pequeno: abrir arquivo X, escrever três linhas, resolver item 1 da lista.',
          ],
        },
        {
          h3: '2. Medo de errar',
          paragraphs: [
            'Adiar pode ser **estrategema para não encarar avaliação**: se você não entrega, não confirma “sou ruim nisso”. O medo não pede licença na forma de frase bonita — aparece como desvio, “preciso pesquisar mais”, revisão infinita.',
            'Chamar isso de **evitar falha** não é drama; é nomear o que liberta. Quando o medo está explícito, dá para combinar versão inicial ruim, prazo de rascunho ou feedback cedo — em vez de ficar parado no perfeccionismo.',
          ],
        },
        {
          h3: '3. Busca por prazer imediato',
          paragraphs: [
            '**Celular, redes sociais e notificações** oferecem recompensa rápida com custo invisível. O contraste é cruel: a tarefa importante pede atenção sustentada; o feed entrega picos curtos. Por isso **por que adiamos tarefas** nem sempre é falta de valor — é competição com estímulos desenhados para prender.',
            'Quando você reconhece esse circuito, deixa de brigar só com “disciplina” e passa a **mudar o placar**: menos gatilhos ao alcance, mais ambiente que favorece o trabalho profundo.',
          ],
        },
        {
          h3: '4. Falta de energia',
          paragraphs: [
            '**Cansaço** e **sono** ruins não são frescura: diminuem a capacidade de segurar impulsos e tolerar tédio. Em dia de bateria baixa, procrastinar é quase previsível — não porque você “não quer”, mas porque o sistema inteiro pede recuperação.',
            'Se a procrastinação aparece junto de fadiga crônica, tratar só “organização” é insuficiente: às vezes o primeiro passo honesto é dormir melhor, comer com regularidade ou reduzir carga antes de cobrar foco heroico.',
          ],
        },
        {
          h3: '5. Excesso de tarefas',
          paragraphs: [
            'Lista grande sem prioridade clara gera **sobrecarga mental**: tudo parece urgente, nada parece começável. O cérebro opta pelo escape porque **decidir entre dez coisas** também gasta energia.',
            'Escolher um “agnóstico de foco” — **uma** próxima ação para os próximos vinte e cinco minutos — reduz o ruído e devolve sensação de controle. Isso ataca **causas da procrastinação** ligadas a excesso, não a falta de boa vontade.',
          ],
        },
      ],
      highlights: [
        {
          variant: 'tip',
          body: 'Antes de julgar, pergunte: esta tarefa está confusa, assustadora, competindo com o celular, ou eu estou sem energia? O remédio muda conforme a causa.',
        },
      ],
    },
    {
      h2: 'O lado psicológico da procrastinação (sem complicar)',
      paragraphs: [
        'Na **psicologia da procrastinação**, um ponto aparece de novo e de novo: na hora H, **emoções mandam mais que lógica**. Você “sabe” que devia — mas a parte que quer alívio agora fala mais alto que o argumento sensato. Por isso palestra bonita nem sempre cola: ela não substitui sensação.',
        'Também entra **comportamento automático**: você nem discute com consciência cheia; repete rota de menor atrito (abrir abas, pegar o celular). Automatismo não é desculpa eterna — mas mostra por que **falta de motivação** e procrastinação andam juntas: motivação oscila, e hábito preenche o vazio quando ela some.',
        'Quando você nomeia o ciclo (“estou evitando desconforto, não sou incompetente”), já troca vergonha por problema solúvel. Isso não é terapia substituta; é **linguagem útil** para agir no mundo real.',
      ],
    },
    {
      h2: 'Como reduzir a procrastinação no cotidiano',
      paragraphs: [
        'Reduzir não é eliminar 100% das fugas — é **deslocar o padrão** na direção do que você valoriza. Três alicerces aparecem em quase todo protocolo simples:',
      ],
      list: [
        '**Dividir tarefas** até cada pedaço caber num bloco curto com começo e fim claros.',
        '**Clareza** em primeiro lugar: nome próximo passo como se fosse instrução para outra pessoa.',
        '**Começar pequeno** para baixar resistência — movimento honesto de dois minutos já quebra o gelo.',
      ],
    },
    {
      h2: 'Erros comuns quando falamos de procrastinação',
      paragraphs: [
        'Três narrativas atrapalham mais do que ajudam:',
      ],
      list: [
        '**Achar que é só falta de disciplina** — disciplina sem sistema depende de humor; sistema sem culpa dura mais.',
        '**Depender de motivação** — motivação é inconsistente; combinados de tempo, ambiente e primeira ação mínima seguram melhor o dia.',
        '**Ignorar o problema** — rotular como “sou assim” congela; separar causa (medo, cansaço, confusão, excesso) destrava.',
      ],
      highlights: [
        {
          variant: 'warning',
          body: 'Culpa infinita não é estratégia: ela gasta energia que poderia virar um único próximo passo concreto.',
        },
      ],
    },
    {
      h2: 'Como aplicar hoje (cinco passos)',
      paragraphs: [
        'Use como roteiro curto quando sentir que está empurrando com a barriga:',
      ],
      subsections: [
        {
          h3: '1. Identifique o motivo',
          paragraphs: [
            'É confusão? Medo? Cansaço? Tentação do celular? Lista demais? Um rótulo honesto já corta metade do drama e aponta ferramenta certa.',
          ],
        },
        {
          h3: '2. Simplifique a tarefa',
          paragraphs: [
            'Reescreva em uma linha o que seria “feito o suficiente” nos próximos vinte e cinco minutos — não o projeto inteiro.',
          ],
        },
        {
          h3: '3. Comece pequeno',
          paragraphs: [
            'Combine dois minutos ou uma linha ou um item só. Objetivo é **atravessar o começo**, não fechar montanha.',
          ],
        },
        {
          h3: '4. Use Pomodoro',
          paragraphs: [
            'Um ciclo no **[Pomodoro](/pomodoro)** cria acordo claro com você mesmo: foco delimitado, pausa planejada. Isso ajuda quando **falta de motivação** e procrastinação competem pela mesma tarde.',
          ],
        },
        {
          h3: '5. Continue',
          paragraphs: [
            'Se entrou em fluxo, encadeie outro bloco. Se não, registre onde parou numa frase para amanhã não renegociar do zero.',
          ],
        },
      ],
    },
    {
      h2: 'Dica prática',
      paragraphs: [
        '👉 **Entender o problema é o primeiro passo para resolver**. Quando você deixa de tratar procrastinação como defeito de caráter e passa a enxergar **causas da procrastinação** — emoção, cansaço, confusão, excesso — o mesmo dia pode mudar de tom: menos autocrítica circular, mais ajuste simples no ambiente e na tarefa.',
      ],
    },
  ],
  conclusion: [
    '**Por que procrastinamos**? Porque somos humanos: buscamos alívio rápido, evitamos desconforto, cansamos e nos perdemos em listas grandes. **Procrastinação é natural** em doses — vira problema quando rouba o que você diz que importa.',
    'Boa notícia: **pode ser controlada** quando você combina clareza, primeiro passo pequeno e tempo delimitado — sem pedir perfeição emocional antes de agir.',
    '👉 Use o **[Pomodoro](/pomodoro)** para **começar tarefas** com blocos curtos e acordo explícito de foco. 👉 Use o **[temporizador](/temporizador)** para **manter ritmo** entre sessões e pausas que não viram horas no celular. 👉 Use o **[cronômetro](/cronometro)** para **acompanhar progresso** e ver quanto tempo real você já investiu — número honesto ajuda a contrapor a sensação de “não fiz nada”. Para um guia passo a passo após entender as causas, siga para **[como parar de procrastinar](/blog/como-parar-de-procrastinar)**.',
  ],
  tip: '👉 Escreva num papel “por que estou adiando?” com uma palavra só (medo/cansaço/confusão/excesso/tentação) antes de abrir qualquer app — isso costuma ser mais barato que lutar contra você mesmo em silêncio.',
});
