/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',      // Golf green
        secondary: '#8BC34A',    // Light green
        accent: '#FFD700',       // Gold
        text: '#2c3e50',
        background: '#f5f7fa',
        gray: '#95a5a6',
        lightGray: '#ecf0f1',
        error: '#e74c3c',
        warning: '#f39c12',
        success: '#27ae60',
        gold: '#FFD700',
        lightPrimary: '#E8F5E9',
        lightSuccess: '#e8f8f5',
        lightWarning: '#fef5e7',
        lightError: '#fdedec',
        lightGold: '#FFF9C4',
        lightGreen: '#E8F5E9',
        lightBlue: '#e1f0fa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'swing': 'swing 1.5s ease-in-out',
      },
      keyframes: {
        swing: {
          '0%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}