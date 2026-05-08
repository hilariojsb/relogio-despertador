import type { Metadata } from 'next';
import { TemporizadorLanding } from './TemporizadorLanding';

export const metadata: Metadata = {
  title: 'Temporizador Online Grátis (Contagem Regressiva e Alarme)',
  description:
    'Temporizador online grátis com contagem regressiva precisa e alerta. Ideal para estudos, cozinha, treinos e produtividade. Simples e rápido.',
};

export default function TemporizadorPage() {
  return <TemporizadorLanding />;
}
