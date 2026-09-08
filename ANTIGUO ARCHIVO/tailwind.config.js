module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          wine: '#5f2036',
          violet: '#7b4f87',
          gold: '#d6a62f',
          cream: '#f5ede5',
          soft: '#1f1a17'
        }
      },
      boxShadow: {
        soft: '0 28px 80px rgba(31, 26, 23, 0.12)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif']
      }
    }
  },
  plugins: []
}
