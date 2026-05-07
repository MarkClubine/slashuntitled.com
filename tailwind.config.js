/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './content/**/*.{json,md}'
  ],
  theme: {
    extend: {
      colors: {
        glow: 'rgb(255 140 100 / 0.35)'
      }
    }
  },
  plugins: []
}
