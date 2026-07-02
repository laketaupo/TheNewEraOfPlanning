/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Scans the vanilla JS render functions + shell HTML for literal Tailwind class strings.
  // Dynamic class-string concatenation (e.g. `text-${color}-600`) is invisible to this scanner —
  // any such pattern must be added to `safelist` below or refactored to a literal lookup map.
  content: ['./index.html', './404.html', './js/**/*.js'],
  safelist: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        neutral: {
          800: '#363636',
          900: '#2c2c2c',
          950: '#222222',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
