/* global describe, it, expect */

import { initTypography } from './typography'

describe('initTypography', () => {
  it('applies typographical enhancements', () => {
    document.body.innerHTML = '<div class="thefifthworld"><p>"We\'ve got apostrophes, and quotes" -- and we\'ve got dashes!</p></div>'
    initTypography()
    expect(document.body.innerHTML).toEqual('<div class="thefifthworld"><p><span class="dquo">“</span>We’ve got apostrophes, and quotes” — and we’ve got<span class="widont">&nbsp;</span>dashes!</p></div>')
  })
})
