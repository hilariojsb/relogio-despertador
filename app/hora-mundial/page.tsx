import type { Metadata } from 'next';
import AdBanner from '@/components/ads/AdBanner';
import { AppShell, FaqList, InfoCard, PageHeader } from '@/components/layout';
import WorldClock from '@/components/features/world-clock/WorldClock';

export const metadata: Metadata = {
  title: 'Hora mundial em tempo real',
  description:
    'Veja a hora atual em várias cidades. Relógio mundial com fuso horário em tempo real.',
};

export default function HoraMundialPage() {
  return (
    <AppShell maxWidth="5xl">
      <AdBanner slot="top" />

      <PageHeader
        eyebrow="Hora mundial"
        title="Relógio mundial em tempo real"
        description="Fusos em tempo real — adicione ou remova cidades conforme precisar."
      />

      <section className="animate-fade-up">
        <WorldClock />
      </section>

      <AdBanner slot="middle" />

      <InfoCard title="Como usar">
        <ol className="list-inside list-decimal space-y-2">
          <li>Adicione cidades à lista com o controle da ferramenta.</li>
          <li>Compare fusos para reuniões, viagens ou suporte internacional.</li>
          <li>Remova cidades que não precisar para manter a lista enxuta.</li>
        </ol>
      </InfoCard>

      <InfoCard title="Dicas">
        <p className="mb-3 leading-relaxed">
          Horários de referência (podem variar com horário de verão local):
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            { zone: 'UTC−5', label: 'Nova York (EST)' },
            { zone: 'UTC−3', label: 'São Paulo (BRT)' },
            { zone: 'UTC+0', label: 'Londres (GMT)' },
            { zone: 'UTC+1', label: 'Paris (CET)' },
            { zone: 'UTC+4', label: 'Dubai (GST)' },
            { zone: 'UTC+9', label: 'Tóquio (JST)' },
          ].map(({ zone, label }) => (
            <div key={zone} className="flex items-center gap-2 text-sm">
              <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 font-mono text-xs text-primary">
                {zone}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </InfoCard>

      <InfoCard title="Perguntas frequentes">
        <FaqList
          items={[
            {
              question: 'A hora é oficial?',
              answer:
                'O relógio segue o fuso e o horário do seu navegador/dispositivo para calcular conversões. Valide em contextos críticos (aviação, contratos) com fonte oficial.',
            },
            {
              question: 'Horário de verão aparece automaticamente?',
              answer:
                'Depende das regras embutidas no sistema e na base de fusos do navegador. Confira datas de mudança em cada país.',
            },
            {
              question: 'Quantas cidades posso adicionar?',
              answer:
                'Use o que for confortável para leitura; listas muito longas podem exigir rolagem em telas pequenas.',
            },
          ]}
        />
      </InfoCard>

      <AdBanner slot="bottom" />
    </AppShell>
  );
}
