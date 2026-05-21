/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#12121a',
        'surface-light': '#1a1a2e',
        accent: '#6c5ce7',
        'accent-light': '#a29bfe',
        'accent-glow': 'rgba(108, 92, 231, 0.35)',
        success: '#00cec9',
        danger: '#ff6b6b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
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
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(108, 92, 231, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(108, 92, 231, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
