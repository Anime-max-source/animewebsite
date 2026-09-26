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
        // ── Existing admin theme tokens (DO NOT TOUCH) ──────────────────────
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
        },
        // ── Kinetic Editorial storefront tokens (scoped — storefront only) ──
        sf: {
          // Canvas
          canvas:     '#FFFFFF',
          surface:    '#F8F8F6',
          surfaceHov: '#F1F1EE',
          // Accent
          accent:     '#DC2626',
          accentHov:  '#B91C1C',
          // Text
          textPrimary:'#111111',
          textMuted:  '#6B6B6B',
          // Border
          border:     '#E5E5E5',
        },
      },
      fontFamily: {
        // ── Existing admin fonts (DO NOT TOUCH) ─────────────────────────────
        sans:    ['Outfit', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        // ── Kinetic Editorial storefront fonts (scoped) ─────────────────────
        'sf-display': ['Syne', 'sans-serif'],
        'sf-body':    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        // ── Kinetic Editorial: single radius (12px = 0.75rem) ───────────────
        'sf': '0.75rem',
      },
      boxShadow: {
        // ── Existing admin shadows (DO NOT TOUCH) ───────────────────────────
        'glow-primary':   '0 0 25px -5px rgba(255, 51, 102, 0.4)',
        'glow-secondary': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-card':      '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px -2px rgba(139, 92, 246, 0.15)',
        // ── Kinetic Editorial: no drop shadows; only border-based elevation ─
        'sf-none': 'none',
      },
      backgroundImage: {
        // ── Existing admin gradients (DO NOT TOUCH) ──────────────────────────
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':    'radial-gradient(circle at 50% 20%, rgba(255, 51, 102, 0.15) 0%, rgba(139, 92, 246, 0.08) 35%, rgba(10, 12, 20, 0) 70%)',
      },
      maxWidth: {
        'sf': '1440px',
      },
    },
  },
  plugins: [],
}
