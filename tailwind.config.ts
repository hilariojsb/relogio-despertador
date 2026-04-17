import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--text)',
        },
        popover: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--text)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--text)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--text)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--danger-rgb) / <alpha-value>)',
          foreground: '#ffffff',
        },
        border: 'var(--border)',
        input: 'var(--border)',
        ring: 'var(--ring)',
        success: 'var(--success)',
        'accent-bright': 'var(--accent-bright)',
        'accent-soft': 'var(--accent-soft)',
        chart: {
          '1': 'rgb(var(--primary-rgb) / <alpha-value>)',
          '2': 'rgb(var(--danger-rgb) / <alpha-value>)',
          '3': 'var(--success)',
          '4': 'var(--text-secondary)',
          '5': 'var(--border)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'alarm-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'alarm-pulse': 'alarm-pulse 1.2s ease-in-out infinite',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        theme: '300ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
