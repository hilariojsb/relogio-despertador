import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(10);

export default function Despertador10MinutosPage() {
  return <DespertadorBasePage tempo={10} />;
}
