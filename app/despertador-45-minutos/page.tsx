import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(45);

export default function Despertador45MinutosPage() {
  return <DespertadorBasePage tempo={45} />;
}
