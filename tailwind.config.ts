import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Noto Naskh Arabic"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          pale: '#F5EDD8',
        },
        cream: '#FDFBF7',
        ink: {
          DEFAULT: '#1A1611',
          soft: '#3D3428',
          muted: '#7A6E62',
        },
      },
      borderRadius: {
        sm: '12px',
        md: '20px',
        lg: '32px',
      },
    },
  },
  plugins: [],
} satisfies Config
