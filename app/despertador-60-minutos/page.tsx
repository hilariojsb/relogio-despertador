import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(60);

export default function Despertador60MinutosPage() {
  return <DespertadorBasePage tempo={60} />;
}
