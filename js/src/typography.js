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
      const textareasMarked = root.innerHTML.replace(/<textarea((\r|\n|.)*?)<\/textarea>/gm, 'BEGINTEXTAREA<textarea$1</textarea>ENDTEXTAREA')
      const strings = textareasMarked.split(/BEGINTEXTAREA((\r|\n|.)*?)ENDTEXTAREA/gm)
      for (let i = 0; i < strings.length; i++) {
        if (!strings[i].startsWith('<textarea')) {
          const smarty = smartypants(strings[i])
          strings[i] = typogr.typogrify(smarty)
        }
      }
      root.innerHTML = strings.filter(str => str !== '>').join('')
    }
  })
}

export {
  initTypography
}
