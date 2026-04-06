import type { Metadata } from 'next';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, FaqList, InfoCard, PageHeader } from '@/components/layout';
import PomodoroTimer from '@/components/features/pomodoro/PomodoroTimer';

export const metadata: Metadata = {
  title: 'Pomodoro online grátis',
  description:
    'Timer Pomodoro online gratuito: 25 minutos de foco, 5 de pausa. Melhore sua produtividade com a técnica Pomodoro direto no navegador.',
};

export default function PomodoroPage() {
  return (
    <AppShell maxWidth="3xl">
      <AdBanner slot="top" />

      <PageHeader
        eyebrow="Técnica Pomodoro"
        title="Pomodoro online para foco e pausas"
        description="Blocos de foco e pausas curtas para manter ritmo sustentável."
      />

      <section className="animate-fade-up py-2 sm:py-4">
        <PomodoroTimer />
      </section>

      <AdBanner slot="middle" />

      <InfoCard title="Como usar">
        <ol className="list-inside list-decimal space-y-2">
          <li>Escolha a tarefa e inicie o bloco de foco (por exemplo 25 minutos).</li>
          <li>Trabalhe até o alarme; depois faça a pausa curta indicada.</li>
          <li>Repita os ciclos; a cada quatro focos, use uma pausa longa quando a ferramenta oferecer.</li>
          <li>Ajuste tempos nas configurações do timer, se disponível na interface.</li>
        </ol>
      </InfoCard>

      <InfoCard title="Dicas">
        <p className="mb-4 leading-relaxed">
          Criada por Francesco Cirillo, a técnica usa intervalos de trabalho focado alternados com pausas, reduzindo
          fadiga mental. Combine com lista de tarefas objetivas para cada bloco.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { step: '1', title: 'Escolha a tarefa', desc: 'Defina o que vai fazer' },
            { step: '2', title: 'Foco 25 min', desc: 'Trabalhe sem distrações' },
            { step: '3', title: 'Pausa 5 min', desc: 'Descanse e recupere' },
            { step: '4', title: 'A cada 4', desc: 'Pausa longa de 15 min' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-xl bg-white/[0.04] p-3 text-center">
              <div className="mb-1 text-xs font-bold text-primary">#{step}</div>
              <p className="text-xs font-semibold text-foreground/90">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: '25 e 5 minutos são obrigatórios?',
              answer:
                'São valores clássicos; o importante é alternar foco e pausa. Ajuste se sua rotina pedir outros tempos.',
            },
            {
              question: 'Serve para estudar?',
              answer:
                'Sim. Use um bloco para leitura ativa, outro para questões e pausas para alongar e hidratar.',
            },
            {
              question: 'E se eu perder o foco no meio?',
              answer:
                'Reinicie o ciclo ou faça uma pausa curta consciente. O timer é um apoio, não uma regra rígida.',
            },
          ]}
        />
      </InfoCard>

      <AdBanner slot="bottom" />
    </AppShell>
  );
}
