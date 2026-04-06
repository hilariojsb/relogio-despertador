import { cn } from '@/lib/utils';

const maxWidthClass = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
} as const;

type MaxWidth = keyof typeof maxWidthClass;

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
}

export function AppShell({ children, className, maxWidth = '4xl' }: AppShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 pt-6 sm:px-5 sm:pt-8 md:px-6',
        'space-y-8 sm:space-y-10',
        'min-h-[calc(100vh-3.5rem)]',
        'pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(3rem,env(safe-area-inset-bottom,0px))]',
        maxWidthClass[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
