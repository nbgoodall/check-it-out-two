const { cursor } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      cursor: {
        ...cursor,
        crosshair: 'crosshair',
        'zoom-in': 'zoom-in'
      }
    },
  },
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
    display: ['responsive', 'group-hover']
  },
  plugins: [],
}
