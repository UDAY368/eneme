import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './admin/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eneme: {
          primary: '#0f172a',
          secondary: '#1e293b',
          accent: '#3b82f6',
          muted: '#64748b',
          foreground: '#f8fafc',
        },
        cinema: {
          black: '#000000',
          dark: '#0A0A0A',
          section: '#111111',
          card: '#141414',
          white: '#FFFFFF',
          secondary: '#BFBFBF',
          muted: '#888888',
          gold: '#C8A96A',
          'gold-hover': '#D4AF37',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        cinema: 'rgba(255,255,255,0.08)',
      },
      ringColor: {
        cinema: '#C8A96A',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
