const { defineConfig } = require('vite')
const postcssCharsetRemoval = require('./postcssCharsetRemoval')

module.exports = defineConfig({
  css: {
    postcss: {
      plugins: [postcssCharsetRemoval]
    }
  }
})
