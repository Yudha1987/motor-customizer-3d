/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07080a',
        panel: '#0c0e11',
        ember: {
          DEFAULT: '#e15b34',
          soft: '#f08a60',
          deep: '#b53f20',
        },
      },
      fontFamily: {
        display: ['Bahnschrift', '"Arial Narrow"', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Code"', 'Consolas', '"SF Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(225,91,52,.45), 0 12px 40px -12px rgba(225,91,52,.55)',
      },
    },
  },
  plugins: [],
}
