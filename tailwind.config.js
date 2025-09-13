/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'iran-sans': ['Iran Sans', 'sans-serif'],
      },
      colors: {
        primary: '#3674B5',
        secondary: '#578FCA',
        accent: '#A1E3F9',
        soft: '#D1F8EF',
        'text-body': '#1F2937',
        'text-heading': '#0F172A',
        'gradient-start': '#3674B5',
        'gradient-end': '#578FCA',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3674B5 0%, #578FCA 100%)',
        'gradient-card': 'linear-gradient(135deg, #A1E3F9 0%, #D1F8EF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #3674B5 0%, #578FCA 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(54, 116, 181, 0.1)',
        'card': '0 8px 32px rgba(54, 116, 181, 0.15)',
        'hero': '0 20px 60px rgba(54, 116, 181, 0.3)',
      }
    },
  },
  plugins: [],
};