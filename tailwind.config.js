/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCFBF8',
          100: '#F7F5EF',
          200: '#EFECE2',
          300: '#E4DFCE',
          400: '#D5CDBC',
          500: '#C2B8A3',
        },
        primary: {
          DEFAULT: '#1F6B4F',
          dark: '#16523C',
          darker: '#0E3B2A',
          light: '#EAF3ED',
          surface: '#DCEBDD',
          hover: '#278060',
          50: '#F2F8F4',
          100: '#E2EFE7',
          200: '#C4DECة',
          500: '#1F6B4F',
          600: '#1A5A42',
          700: '#144634',
        },
        accent: {
          DEFAULT: '#F2A93B',
          hover: '#E09626',
          light: '#FEF6E8',
          dark: '#C87B11',
        },
        charcoal: {
          DEFAULT: '#1E2521',
          light: '#425149',
          muted: '#697A71',
          border: '#E3DFD5',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(30, 37, 33, 0.04), 0 1px 3px rgba(30, 37, 33, 0.02)',
        'card': '0 4px 20px -2px rgba(30, 37, 33, 0.05), 0 2px 6px -1px rgba(30, 37, 33, 0.03)',
        'dropdown': '0 10px 30px -5px rgba(30, 37, 33, 0.12), 0 4px 10px -2px rgba(30, 37, 33, 0.06)',
        'glow': '0 0 25px -5px rgba(31, 107, 79, 0.25)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'sparkle': 'sparkle 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
}
