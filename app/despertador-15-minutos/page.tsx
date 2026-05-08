import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(15);

export default function Despertador15MinutosPage() {
  return <DespertadorBasePage tempo={15} />;
}
