import type { Metadata } from 'next';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, FaqList, InfoCard, PageHeader } from '@/components/layout';
import Timer from '@/components/features/timer/Timer';

export const metadata: Metadata = {
  title: 'Temporizador online grátis',
  description:
    'Temporizador online com contagem regressiva, presets rápidos e alarme sonoro. Ideal para culinária, exercícios e estudos.',
};

export default function TemporizadorPage() {
  return (
    <AppShell maxWidth="3xl">
      <AdBanner slot="top" />

      <PageHeader
        eyebrow="Temporizador online"
        title="Temporizador com alarme sonoro"
        description="Contagem regressiva com alarme sonoro e presets rápidos."
      />

      <section className="animate-fade-up py-2 sm:py-4">
        <Timer />
      </section>

      <AdBanner slot="middle" />

      <InfoCard title="Como usar">
        <ol className="list-inside list-decimal space-y-2">
          <li>Defina minutos e segundos ou escolha um preset rápido, se disponível.</li>
          <li>Inicie a contagem; o alarme toca ao chegar em zero.</li>
          <li>Pausar ou reiniciar conforme a tarefa; ajuste o volume do sistema se precisar ouvir de longe.</li>
        </ol>
      </InfoCard>

      <InfoCard title="Dicas">
        <p className="mb-3 leading-relaxed">
          Usos comuns: cozinha, exercícios, estudos, pausas curtas e lembretes de medicação.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: '🍕', text: 'Culinária' },
            { icon: '🏋️', text: 'Exercício' },
            { icon: '📚', text: 'Estudos' },
            { icon: '🧘', text: 'Meditação' },
            { icon: '☕', text: 'Café / chá' },
            { icon: '🎮', text: 'Pausas' },
            { icon: '💊', text: 'Medicação' },
            { icon: '🚿', text: 'Banho' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm">
              <span aria-hidden>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'O alarme toca com a aba em segundo plano?',
              answer:
                'Depende do navegador. Em geral, mantenha a aba aberta e o volume do sistema adequado.',
            },
            {
              question: 'Posso pausar no meio?',
              answer:
                'Sim, use os controles do temporizador para pausar ou zerar conforme a interface exibir.',
            },
            {
              question: 'Funciona sem internet?',
              answer:
                'Depois de carregar a página, muitas funções seguem disponíveis offline no navegador.',
            },
          ]}
        />
      </InfoCard>

      <AdBanner slot="bottom" />
    </AppShell>
  );
}
