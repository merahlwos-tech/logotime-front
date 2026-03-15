/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple:  '#6C2BD9',
        'purple-dark': '#4A1A9E',
        'purple-deep': '#1E0A4A',
        'purple-mid':  '#8B45E8',
        yellow:  '#FFD600',
        'off-white': '#F8F7FF',
      },
      fontFamily: {
        sans:    ['Poppins', 'sans-serif'],
        arabic:  ['Tajawal', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}