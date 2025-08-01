/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        party: {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
          accent: '#45b7d1',
          warm: '#f9ca24',
          pink: '#f0932b',
          purple: '#6c5ce7',
        }
      },
      fontFamily: {
        'party': ['Comic Sans MS', 'cursive'],
        'display': ['Arial', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-slow-reverse': 'reverse-spin 10s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}