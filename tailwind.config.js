/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        anime: {
          bg: '#0a0c14',
          card: '#121624',
          cardHover: '#181e30',
          border: '#23293d',
          primary: '#ff3366',
          primaryHover: '#e02456',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          gold: '#f59e0b',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif']
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(255, 51, 102, 0.4)',
        'glow-secondary': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px -2px rgba(139, 92, 246, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(circle at 50% 20%, rgba(255, 51, 102, 0.15) 0%, rgba(139, 92, 246, 0.08) 35%, rgba(10, 12, 20, 0) 70%)',
      }
    },
  },
  plugins: [],
}
