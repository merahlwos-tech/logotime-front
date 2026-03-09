/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:    '#ec5b13',
        mauve:      '#4b2038',
        'mauve-light': '#6b3055',
        charcoal:   '#221610',
        gold:       '#ce8db1',
        'gold-light': '#e8b8d4',
        'bg-light':  '#f8f6f6',
        'bg-dark':   '#221610',
        'text-main': '#1a0e0a',
        'text-soft': '#6b5a54',
        'text-muted':'#a08880',
      },
      fontFamily: {
        display: ['"Public Sans"', 'sans-serif'],
        body:    ['"Public Sans"', 'sans-serif'],
      },
      animation: {
        'fade-up':  'fadeUp 0.7s ease-out both',
        'fade-in':  'fadeIn 0.5s ease-out both',
        'marquee':  'marquee 35s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: 0.4 },
          '50%':      { opacity: 1 },
        },
      },
      boxShadow: {
        'fairy':  '0 0 20px rgba(206, 141, 177, 0.35)',
        'fairy-lg': '0 0 40px rgba(206, 141, 177, 0.25)',
        'dark':   '0 4px 24px rgba(0,0,0,0.4)',
        'dark-lg':'0 8px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}