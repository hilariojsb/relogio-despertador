'use client';

import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  function toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border',
        'bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground transition-all',
        'hover:bg-muted hover:text-foreground active:scale-[0.98]'
      )}
      aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="h-4 w-4" aria-hidden />
          Sair da tela cheia
        </>
      ) : (
        <>
          <Maximize2 className="h-4 w-4" aria-hidden />
          Tela cheia
        </>
      )}
    </button>
  );
}
