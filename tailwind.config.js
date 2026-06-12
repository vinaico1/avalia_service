/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page:   '#F0F0EE',
        card:   '#FFFFFF',
        raised: '#F7F7F6',
        border: '#E4E4E0',
        ink: {
          DEFAULT: '#1A1A1A',
          muted:   '#6B7280',
          faint:   '#D1D5DB',
        },
        brand: {
          50:  '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        },
        danger: { DEFAULT: '#EF4444', dim: '#FEE2E2', text: '#B91C1C' },
        warn:   { DEFAULT: '#F59E0B', dim: '#FEF3C7', text: '#92400E' },
        ok:     { DEFAULT: '#22C55E', dim: '#DCFCE7', text: '#15803D' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      screens:    { xs: '375px' },
      boxShadow: {
        card:  '0 1px 3px 0 rgba(0,0,0,0.08), 0 4px 16px 0 rgba(0,0,0,0.06)',
        sheet: '0 -4px 32px 0 rgba(0,0,0,0.12)',
        btn:   '0 2px 8px 0 rgba(22,163,74,0.30)',
      },
    },
  },
  plugins: [],
}
