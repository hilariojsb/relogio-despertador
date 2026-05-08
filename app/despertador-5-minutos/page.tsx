import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(5);

export default function Despertador5MinutosPage() {
  return <DespertadorBasePage tempo={5} />;
}
