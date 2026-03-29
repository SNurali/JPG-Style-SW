/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a1a2e', light: '#16213e', dark: '#0f0f23' },
        secondary: '#c0c0c0',
        accent: { DEFAULT: '#4361ee', hover: '#3a56d4' },
        danger: '#e63946',
        surface: '#0f0f23',
        'text-main': '#e0e0e0',
        'text-muted': '#8888a0',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: { card: '12px', button: '8px' },
    },
  },
  plugins: [],
};
