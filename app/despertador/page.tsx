import type { Metadata } from 'next';
import DespertadorLanding from '@/components/features/despertador/DespertadorLanding';
import { DespertadorHubExtraSections } from '@/components/features/despertador/DespertadorHubExtraSections';
import { DespertadorRelatedSeoLinks } from '@/components/features/despertador/DespertadorRelatedSeoLinks';

export const metadata: Metadata = {
  title: 'Despertador online grátis',
  description:
    'Configure alarmes online gratuitamente. Múltiplos despertadores com som, sem precisar instalar nada. Funciona direto no navegador.',
};

export default function DespertadorPage() {
  return (
    <DespertadorLanding
      pageHeader={{
        eyebrow: 'Despertador online',
        title: 'Despertador online grátis',
        description: 'Configure quantos alarmes precisar.',
      }}
      howToTitle="Como usar o despertador online"
      howToItems={[
        'Escolha um horário ou use os atalhos (+5, +10, +30 min).',
        'Opcionalmente defina um rótulo para identificar o alarme.',
        'Toque em adicionar para incluir na lista.',
        'Mantenha a aba aberta para o alarme disparar no horário.',
        'Use "Parar alarme" para silenciar quando tocar.',
      ]}
      additionalSections={<DespertadorHubExtraSections />}
      belowContent={
        <div className="pt-2">
          <DespertadorRelatedSeoLinks />
        </div>
      }
    />
  );
}
