/* global describe, it, expect */

import { select } from '../../utils'
import initFigures from './index'

describe('initFigures', () => {
  it('does nothing if there are no figures', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initFigures(select('figcaption.numbered'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('does nothing if no figures request numbering', () => {
    document.body.innerHTML = '<main class="thefifthworld"><figure><figcaption>Caption</figcaption></figure></main>'
    initFigures(select('figcaption.numbered'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><figure><figcaption>Caption</figcaption></figure></main>')
  })

  it('adds numbering to figure captions', () => {
    document.body.innerHTML = '<main class="thefifthworld"><figure><figcaption class="numbered">Caption</figcaption></figure></main>'
    initFigures(select('figcaption.numbered'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><figure><figcaption><strong>Figure 1.</strong> Caption</figcaption></figure></main>')
  })

  it('doesn&rsquo;t double-numbered if called twice', () => {
    document.body.innerHTML = '<main class="thefifthworld"><figure><figcaption class="numbered">Caption</figcaption></figure></main>'
    initFigures(select('figcaption.numbered'))
    initFigures(select('figcaption.numbered'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><figure><figcaption><strong>Figure 1.</strong> Caption</figcaption></figure></main>')
  })

  it('adds numbering to only those figure captions that request it', () => {
    document.body.innerHTML = '<main class="thefifthworld"><figure><figcaption class="numbered">Caption</figcaption></figure><figure><figcaption>Caption</figcaption></figure><figure><figcaption class="numbered">Caption</figcaption></figure></main>'
    initFigures(select('figcaption.numbered'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><figure><figcaption><strong>Figure 1.</strong> Caption</figcaption></figure><figure><figcaption>Caption</figcaption></figure><figure><figcaption><strong>Figure 2.</strong> Caption</figcaption></figure></main>')
  })
})
