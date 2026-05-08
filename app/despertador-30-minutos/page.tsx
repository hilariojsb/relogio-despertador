import { DespertadorBasePage } from '@/components/despertador-landing/DespertadorBasePage';
import { buildTimerPageMetadata } from '@/lib/constants/despertador-timer-pages';

export const metadata = buildTimerPageMetadata(30);

export default function Despertador30MinutosPage() {
  return <DespertadorBasePage tempo={30} />;
}
