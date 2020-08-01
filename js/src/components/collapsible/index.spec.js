/* global describe, it, expect, Event */

import { select } from '../../utils'
import initCollapsibles from './index'

describe('initCollapsibles', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initCollapsibles(select('.collapsible'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('initializes collapsible elements', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><h3>Toggle</h3><p>Content.</p></aside></main>'
    initCollapsibles(select('.collapsible'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><h3 class="toggle">Toggle</h3><div class="togglable" style="height: 0px;"><p>Content.</p></div></aside></main>')
  })

  it('won\'t initialize an element that has no heading', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><p>Content.</p></aside></main>'
    initCollapsibles(select('.collapsible'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><p>Content.</p></aside></main>')
  })

  it('opens when you click the toggle', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><h3>Toggle</h3><p>Content.</p></aside></main>'
    initCollapsibles(select('.collapsible'))
    const toggle = document.querySelector('.toggle')
    toggle.dispatchEvent(new Event('click'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><h3 class="toggle open">Toggle</h3><div class="togglable" style="height: 0px;"><p>Content.</p></div></aside></main>')
  })

  it('opens when you click the toggle a second time', () => {
    document.body.innerHTML = '<main class="thefifthworld"><aside class="collapsible"><h3>Toggle</h3><p>Content.</p></aside></main>'
    initCollapsibles(select('.collapsible'))
    const toggle = document.querySelector('.toggle')
    toggle.dispatchEvent(new Event('click'))
    toggle.dispatchEvent(new Event('click'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><aside class="collapsible"><h3 class="toggle">Toggle</h3><div class="togglable" style="height: 0px;"><p>Content.</p></div></aside></main>')
  })
})
