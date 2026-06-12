/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app:   '#08080F',
        card:  '#111118',
        raised:'#1A1A26',
        border:'#1E1E2E',
        lime:  { DEFAULT:'#AAFF00', dark:'#88CC00', dim:'#AAFF0022' },
        ink:   { DEFAULT:'#FFFFFF', muted:'#6B6B88', faint:'#2E2E40' },
        danger:{ DEFAULT:'#FF4455', dim:'#FF445520' },
        warn:  { DEFAULT:'#FFB020', dim:'#FFB02020' },
        ok:    { DEFAULT:'#00E087', dim:'#00E08720' },
        brand: {
          50:'#f0fdf4', 100:'#dcfce7', 200:'#bbf7d0', 300:'#86efac',
          400:'#4ade80', 500:'#22c55e', 600:'#16a34a', 700:'#15803d',
          800:'#166534', 900:'#14532d',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      screens: { xs: '375px' },
      boxShadow: {
        'lime': '0 0 24px 0 rgba(170,255,0,0.18)',
        'card': '0 2px 16px 0 rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
