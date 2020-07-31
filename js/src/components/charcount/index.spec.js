/* global describe, it, expect */

import { select } from '../../utils'
import initCharCount from './index'

describe('initCharCount', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initCharCount(select('textarea[data-char-count]'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('initializes character count textareas', () => {
    document.body.innerHTML = '<main class="thefifthworld"><textarea data-char-count="240"></textarea></main>'
    initCharCount(select('textarea[data-char-count]'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><textarea data-char-count="240"></textarea><p class="char-count">0 characters (240 left)</p></main>')
  })

  it('wraps remaining in error span if fewer than 30 characters remain', () => {
    document.body.innerHTML = '<main class="thefifthworld"><textarea data-char-count="240">The world has changed. The ruins of ancient cities lie submerged beneath the swollen seas. Beaches of translucent plastic sand mark new boundaries between land and water. Jungles stretch from the equator to the poles.</textarea></main>'
    initCharCount(select('textarea[data-char-count]'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><textarea data-char-count="240">The world has changed. The ruins of ancient cities lie submerged beneath the swollen seas. Beaches of translucent plastic sand mark new boundaries between land and water. Jungles stretch from the equator to the poles.</textarea><p class="char-count">217 characters <span class="error">(23 left)</span></p></main>')
  })
})
