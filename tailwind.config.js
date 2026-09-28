/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans"', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Amiri"', 'serif'],
        arabic: ['"Amiri Quran"', '"Amiri"', 'serif'],
      },
      colors: {
        midnight: {
          50: '#f0fdf4',
          100: '#f8fafc',
          200: '#e8f0ed',
          300: '#a8c4b8',
          400: '#6b8a7d',
          500: '#3d6354',
          600: '#1a4a37',
          700: '#0d3527',
          800: '#062018',
          900: '#031310',
          950: '#010a08',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef08a',
          200: '#fde68a',
          300: '#f59e0b',
          400: '#d97706',
          500: '#b45309',
          600: '#92400e',
          700: '#78350f',
          800: '#5c2d0c',
          900: '#4a2410',
        },
        emerald2: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        teal2: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(217, 119, 6, 0.15)' },
          '50%': { boxShadow: '0 0 50px rgba(217, 119, 6, 0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
