/* global describe, it, expect */

import { select } from '../../utils'
import initPulse from './index'

describe('initFigures', () => {
  it('does nothing if there are no pulse components', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initPulse(select('.message.pulse:not(.initialized)'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('marks the pulse component as initialized', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p><aside class="message warning pulse"><p>Your session will expire in 15 minutes.</p></aside></main>'
    initPulse(select('.message.pulse:not(.initialized)'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p><aside class="message warning pulse initialized"><p>Your session will expire in 15 minutes.</p></aside></main>')
  })

  it('only initializes the first pulse component', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p><aside class="message warning pulse"><p>Your session will expire in 15 minutes.</p></aside><aside class="message warning pulse"><p>A second pulse component is ignored.</p></aside></main>'
    initPulse(select('.message.pulse:not(.initialized)'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p><aside class="message warning pulse initialized"><p>Your session will expire in 15 minutes.</p></aside><aside class="message warning pulse"><p>A second pulse component is ignored.</p></aside></main>')
  })
})
