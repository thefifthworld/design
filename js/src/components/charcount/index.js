import { create, next, hasClass } from '../../utils'

/**
 * Initialize character-count textareas.
 * @param textareas {Element[]} - An array of textarea elements to initialize
 *   with character-counting behavior.
 */

const initCharCount = textareas => {
  textareas.forEach(textarea => {
    const max = parseInt(textarea.dataset.charCount)
    const curr = textarea.value.length
    const remaining = max - curr
    const n = next(textarea)
    if (!n || !hasClass(n, 'char-count')) {
      const p = create('p', ['char-count'], null, `${curr} characters (${remaining} left)`)
      textarea.insertAdjacentElement('afterend', p)
    }
  })
}

module.exports = initCharCount
