import typogr from 'typogr'
import smartypants from 'smartypants'
import { ready } from './utils'

/**
 * Initialize all JavaScript-based typographic enhancements.
 */

const initTypography = () => {
  ready(() => {
    const root = document.querySelector('.thefifthworld')
    if (root) {
      const smarty = smartypants(root.innerHTML)
      root.innerHTML = typogr.typogrify(smarty)
    }
  })
}

export {
  initTypography
}
