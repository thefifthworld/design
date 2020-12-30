/* global describe, it, expect, document */

import { select } from '../../utils'
import initLikes from './index'

describe('initLikes', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initLikes(select('.likes'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })
})
