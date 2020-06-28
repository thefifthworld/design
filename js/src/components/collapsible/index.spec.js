/* global describe, it, expect */

import initCollapsibles from './index'

describe('initCollapsibles', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initCollapsibles()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('initializes collapsible elements', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><h3>Toggle</h3><p>Content.</p></aside></main>'
    initCollapsibles()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><h3 class="toggle closed">Toggle</h3><div class="togglable"><p>Content.</p></div></aside></main>')
  })

  it('won\'t initialize an element that has no heading', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><p>Content.</p></aside></main>'
    initCollapsibles()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><p>Content.</p></aside></main>')
  })
})