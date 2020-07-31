import { create, next, hasClass } from '../../utils'

const getCount = (curr, max) => {
  const remaining = max - curr
  const chars = curr === 1 ? '1 character' : `${curr} characters`
  if (remaining > 30) {
    return `${chars} (${remaining} left)`
  } else {
    return `${chars} <span class="error">(${remaining} left)</span>`
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
    const txt = getCount(textarea.value.length, max)
    let n = next(textarea)

    // If we don't have a counter yet, make one.
    if (!n || !hasClass(n, 'char-count')) {
      n = create('p', ['char-count'], null, txt)
      textarea.insertAdjacentElement('afterend', n)
    }

    // Set up event listener.
    textarea.addEventListener('keyup', () => {
      n.innerHTML = getCount(textarea.value.length, max)
    })
  })
}

module.exports = initCharCount
