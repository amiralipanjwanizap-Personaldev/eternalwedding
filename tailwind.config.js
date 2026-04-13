/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ivory:    '#FAF7F2',
        cream:    '#F2EDE4',
        blush:    '#E8C5B0',
        rose:     '#C4826A',
        deep:     '#3D2C2C',
        slate:    '#6B5E5E',
        gold:     '#C9A96E',
        'gold-light': '#F0DFB8',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
