import { Plugin } from 'postcss'

const postcssCharsetRemoval: Plugin = {
  postcssPlugin: 'internal:charset-removal',
  AtRule: {
    charset: (atRule) => {
      if (atRule.name === 'charset') {
        atRule.remove()
      }
    }
  }
}

export default postcssCharsetRemoval
