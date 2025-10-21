/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        work: '#10b981', // Green for exercise phase
        rest: '#f59e0b', // Orange for rest phase
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        'touch-target': '44px', // iOS/WCAG minimum touch target
      },
      minWidth: {
        'touch-target': '44px',
      },
    },
    screens: {
      'sm': '640px',  // Mobile landscape / small tablet
      'md': '768px',  // Tablet portrait
      'lg': '1024px', // Desktop
      'xl': '1280px', // Large desktop
    },
  },
  plugins: [],
}
