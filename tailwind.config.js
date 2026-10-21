/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#0a0d14',
          900: '#0f1422',
          850: '#141b2d',
          800: '#1a2238',
          700: '#253252',
          600: '#34456e',
        },
        moderator: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        optimist: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        skeptic: {
          light: '#f87171',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
          glow: 'rgba(239, 68, 68, 0.35)',
        },
        human: {
          light: '#38bdf8',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
          glow: 'rgba(2, 132, 199, 0.35)',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'equalizer-1': 'equalize 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalize 1.1s ease-in-out infinite alternate',
        'equalizer-3': 'equalize 0.9s ease-in-out infinite alternate',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        equalize: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
