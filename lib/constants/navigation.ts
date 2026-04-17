import type { LucideIcon } from 'lucide-react';
import { AlarmClock, Brain, Clock, Globe, Hourglass, Timer } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Relógio', icon: Clock },
  { href: '/despertador', label: 'Despertador', icon: AlarmClock },
  { href: '/cronometro', label: 'Cronômetro', icon: Timer },
  { href: '/temporizador', label: 'Temporizador', icon: Hourglass },
  { href: '/pomodoro', label: 'Pomodoro', icon: Brain },
  { href: '/hora-mundial', label: 'Hora Mundial', icon: Globe },
];
