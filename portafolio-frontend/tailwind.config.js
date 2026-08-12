/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ---------------------------------------------------
      // COLOR — fondo oscuro (carbón) + acentos pastel
      // Los pasteles se usan EXCLUSIVAMENTE para auras,
      // sombras de hover y acentos interactivos.
      // ---------------------------------------------------
      colors: {
        carbon: {
          DEFAULT: '#0B0B0D', // fondo principal
          soft: '#141416',    // secciones elevadas
          raised: '#1C1C1F',  // tarjetas
          line: '#2A2A2D',    // bordes sutiles
        },
        bone: {
          DEFAULT: '#F5F4F1', // texto principal sobre fondo oscuro
          muted: '#8C8C90',   // texto secundario
          dim: '#5A5A5D',     // texto terciario / captions
        },
        mint: {
          DEFAULT: '#BFE8D4',
          soft: '#D9F2E5',
        },
        lavender: {
          DEFAULT: '#D6CCF0',
          soft: '#E8E1F7',
        },
        peach: {
          DEFAULT: '#F3D3B8',
          soft: '#F8E4D2',
        },
      },

      // ---------------------------------------------------
      // TIPOGRAFÍA — familia estilo Helvetica
      // Se usa el stack nativo para máxima nitidez y peso real
      // en Bold/Black, evitando fuentes serif "genéricas de IA".
      // ---------------------------------------------------
      fontFamily: {
        display: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          '-apple-system',
          'sans-serif',
        ],
      },

      fontSize: {
        // Encabezado hero masivo, fluido según viewport
        'display-xl': [
          'clamp(3.25rem, 9vw, 8.5rem)',
          { lineHeight: '0.94', letterSpacing: '-0.035em', fontWeight: '800' },
        ],
        'display-lg': [
          'clamp(2.5rem, 6vw, 5rem)',
          { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        'display-md': [
          'clamp(1.75rem, 3.5vw, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
      },

      // ---------------------------------------------------
      // SOMBRAS / AURAS — glow pastel para hover y elementos 3D
      // ---------------------------------------------------
      boxShadow: {
        'aura-mint': '0 0 140px 50px rgba(191, 232, 212, 0.18)',
        'aura-lavender': '0 0 140px 50px rgba(214, 204, 240, 0.18)',
        'aura-peach': '0 0 140px 50px rgba(243, 211, 184, 0.18)',
        'hover-soft': '0 8px 40px -8px rgba(245, 244, 241, 0.12)',
      },

      // ---------------------------------------------------
      // ANIMACIONES — utilidades base (Framer Motion cubre
      // las orquestadas; estas son ambientales/CSS puras)
      // ---------------------------------------------------
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.08)', opacity: '0.8' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -18px, 0)' },
        },
      },
      animation: {
        breathe: 'breathe 9s ease-in-out infinite',
        'float-slow': 'floatSlow 14s ease-in-out infinite',
      },

      backgroundImage: {
        // Aura radial suave, usada solo detrás de elementos de acento
        'radial-mint': 'radial-gradient(circle, rgba(191,232,212,0.5) 0%, rgba(191,232,212,0) 70%)',
        'radial-lavender': 'radial-gradient(circle, rgba(214,204,240,0.5) 0%, rgba(214,204,240,0) 70%)',
        'radial-peach': 'radial-gradient(circle, rgba(243,211,184,0.5) 0%, rgba(243,211,184,0) 70%)',
      },

      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)', // easing "expo-out" para microinteracciones
      },
    },
  },
  plugins: [],
};