'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    q: 'O relógio está sempre certo?',
    a: 'Segue o relógio do aparelho; ajuste nas definições do sistema se a hora local estiver errada.',
  },
  {
    id: '2',
    q: 'Preciso instalar algum aplicativo?',
    a: 'Não. Tudo abre no navegador, sem instalar.',
  },
  {
    id: '3',
    q: 'Funciona offline?',
    a: 'Depois de carregar, a leitura da hora costuma funcionar sem internet.',
  },
  {
    id: '4',
    q: 'Posso usar no celular?',
    a: 'Sim, em qualquer navegador de celular recente.',
  },
  {
    id: '5',
    q: 'É realmente gratuito?',
    a: 'Sim, o uso básico das ferramentas é grátis, sem cadastro obrigatório.',
  },
] as const;

export default function HomeFaqAccordion() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-border/80">
            <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline sm:text-[15px]">
              {item.q}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-3 text-sm text-muted-foreground">
        <Link href="/contato" className="font-medium text-primary underline-offset-2 hover:underline">
          Fale conosco
        </Link>
      </p>
    </div>
  );
}
