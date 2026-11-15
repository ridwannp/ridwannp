/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        terrace: {
          bg: '#FBFAF7',
          cord: '#1A1720',
          dark: '#141218',
          muted: '#8F879A',
          border: 'rgba(26, 23, 32, 0.08)',
          card: 'rgba(255, 255, 255, 0.75)',
        },
      },
      animation: {
        'marquee-left': 'marqueeLeft 35s linear infinite',
        'marquee-right': 'marqueeRight 35s linear infinite',
        cloudDrift: 'cloudDrift 80s linear infinite',
      },
      keyframes: {
        cloudDrift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(120vw)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}

