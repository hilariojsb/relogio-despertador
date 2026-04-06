import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot: 'top' | 'middle' | 'bottom';
  className?: string;
}

const heights: Record<AdBannerProps['slot'], string> = {
  top: 'min-h-[5rem] sm:min-h-[6rem]',
  middle: 'min-h-[6rem] sm:min-h-[7rem]',
  bottom: 'min-h-[5rem] sm:min-h-[6rem]',
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
