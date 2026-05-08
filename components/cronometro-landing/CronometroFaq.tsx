'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const items = [
  {
    q: 'O cronômetro funciona offline?',
    a: 'Com a página aberta, o cronômetro usa o relógio do seu aparelho. Se perder a conexão, continue na mesma aba; ao fechar o navegador, o temporizador para.',
  },
  {
    q: 'Posso usar no celular?',
    a: 'Sim. Abra o site no navegador do smartphone ou tablet; os botões e o mostrador adaptam-se ao tamanho do ecrã.',
  },
  {
    q: 'A precisão do cronômetro é confiável?',
    a: 'A leitura segue o temporizador do sistema. Para a maioria dos treinos, estudos e tarefas do dia a dia, basta; para calibração científica use equipamento dedicado.',
  },
  {
    q: 'O cronômetro continua contando se eu sair da página?',
    a: 'Se mudar de separador ou minimizar, o contador em geral continua; se fechar a aba ou o navegador, a sessão termina e o tempo perde-se.',
  },
] as const;

export function CronometroFaq() {
  return (
    <Accordion type="single" collapsible className="w-full text-gray-900">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`} className="border-gray-200">
          <AccordionTrigger className="py-4 text-left text-sm font-medium text-gray-900 hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-gray-600">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
