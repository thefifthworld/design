import { create, next, hasClass } from '../../utils'

const getCount = (curr, max) => {
  const remaining = max - curr
  if (remaining > 30) {
    return `${curr} characters (${remaining} left)`
  } else {
    return `${curr} characters <span class="error">(${remaining} left)</span>`
  }
}

/**
 * Initialize character-count textareas.
 * @param textareas {Element[]} - An array of textarea elements to initialize
 *   with character-counting behavior.
 */

const initCharCount = textareas => {
  textareas.forEach(textarea => {
    const max = parseInt(textarea.dataset.charCount)
    const curr = textarea.value.length
    const txt = getCount(curr, max)
    const n = next(textarea)
    if (!n || !hasClass(n, 'char-count')) {
      const p = create('p', ['char-count'], null, txt)
      textarea.insertAdjacentElement('afterend', p)
    }
  })
}

module.exports = initCharCount
