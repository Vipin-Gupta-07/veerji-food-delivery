/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          'orange-dark': '#E85520',
          'orange-light': '#FF8C5A',
          saffron: '#F59E0B',
          dark: '#1A1A1A',
          'dark-2': '#242424',
          'dark-3': '#2E2E2E',
          cream: '#FFF8F0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-sm': 'bounceSm 0.6s ease-in-out',
        'pulse-orange': 'pulseOrange 2s infinite',
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
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255, 107, 53, 0)' },
        },
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #242424 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.15)',
        'orange-glow': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
    },
  },
  plugins: [],
};
