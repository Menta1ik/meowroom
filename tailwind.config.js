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
          50: '#F0F6FA',
          100: '#DBE8F3',
          200: '#BCD3E9',
          300: '#9DBEDF',
          400: '#7EA9D5',
          500: '#2C5F8D', // Основной синий из логотипа
          600: '#24507a',
          700: '#1c4067',
          800: '#142E48',
          900: '#0C1D31',
        },
        accent: {
          50: '#FFFCF0',
          100: '#FFF8CC',
          200: '#FFF099',
          300: '#FFE866',
          400: '#FFD700', // Желтый из логотипа
          500: '#FFC700',
          600: '#E6AC00',
          700: '#CC9900',
          800: '#B38600',
          900: '#997300',
        },
        neutral: {
          50: '#F5F5DC', // Кремовый фон
          100: '#f4f4f0',
          900: '#1a1a1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
