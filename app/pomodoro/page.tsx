import type { Metadata } from 'next';
import PomodoroPageClient from './PomodoroPageClient';

export const metadata: Metadata = {
  title: 'Pomodoro Online 25 Minutos (Foco e Produtividade)',
  description:
    'Use o método Pomodoro online para manter foco e produtividade. Temporizador com ciclos de trabalho e pausa, gratuito no navegador.',
};

export default function PomodoroPage() {
  return <PomodoroPageClient />;
}
