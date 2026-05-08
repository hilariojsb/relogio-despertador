import type { Metadata } from 'next';
import { DespertadorPage } from '@/components/despertador-landing';

export const metadata: Metadata = {
  title: 'Despertador Online Grátis',
  description:
    'Despertador online com alarmes múltiplos, rótulo e volume. Use no navegador, sem instalar. Gratuito e simples.',
};

export default function DespertadorIndexPage() {
  return <DespertadorPage />;
}
