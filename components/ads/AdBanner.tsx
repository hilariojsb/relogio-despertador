import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot: 'top' | 'middle' | 'bottom';
  className?: string;
}

const heights: Record<AdBannerProps['slot'], string> = {
  top: 'min-h-[4.5rem] sm:min-h-[5.5rem]',
  middle: 'min-h-[40px] sm:min-h-[56px]',
  bottom: 'min-h-[4.5rem] sm:min-h-[5.5rem]',
};

/**
 * Reserva espaço vertical para futura inserção de anúncios (ex.: AdSense), sem aparência de placeholder.
 */
export default function AdBanner({ slot, className }: AdBannerProps) {
  return (
    <div
      className={cn('w-full shrink-0 overflow-hidden', heights[slot], className)}
      aria-hidden
      data-ad-slot={slot}
    />
  );
}
