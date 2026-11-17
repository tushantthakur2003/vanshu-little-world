/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB6C1',
          'pink-soft': '#FFE4E8',
          'pink-deep': '#FF758F',
          'pink-blush': '#FFF0F5',
          lavender: '#E8D7F1',
          'lavender-soft': '#F5EEFC',
          'lavender-deep': '#B388EB',
          cream: '#FFFDF9',
          'cream-soft': '#FAF7F2',
          peach: '#FFE5D9',
          'peach-soft': '#FFF1EB',
          'peach-deep': '#FFB088',
          blue: '#E0F2FE',
          'blue-soft': '#F0F9FF',
          'blue-deep': '#7DD3FC',
        },
      },
      fontFamily: {
        handwriting: ['Caveat', 'Gaegu', 'cursive'],
        script: ['Sacramento', 'cursive'],
        cute: ['Comfortaa', 'Quicksand', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'Quicksand', 'sans-serif'],
      },
      boxShadow: {
        'scrapbook': '0 8px 24px -4px rgba(255, 175, 189, 0.25), 0 4px 12px -2px rgba(232, 215, 241, 0.3)',
        'scrapbook-hover': '0 14px 32px -4px rgba(255, 143, 163, 0.35), 0 8px 16px -2px rgba(200, 162, 235, 0.35)',
        'polaroid': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 6px 12px -3px rgba(255, 182, 193, 0.2)',
        'inner-soft': 'inset 0 2px 8px 0 rgba(255, 182, 193, 0.15)',
      },
      animation: {
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'float-reverse': 'floatReverse 4.5s ease-in-out infinite',
        'wiggle-gentle': 'wiggleGentle 3s ease-in-out infinite',
        'heartbeat-soft': 'heartbeatSoft 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(8px) rotate(-1.5deg)' },
        },
        wiggleGentle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        heartbeatSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.2) rotate(15deg)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
