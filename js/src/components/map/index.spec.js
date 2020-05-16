/* global describe, it, expect */

import initMap from './index'

describe('initJumpToNav', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<p>Hello world!</p>'
    initMap()
    expect(document.body.innerHTML).toEqual('<p>Hello world!</p>')
  })

  it('removes no-js entries in leaflet-wrapper', () => {
    document.body.innerHTML = '<main class="leaflet-wrapper"><div class="no-js">No JS</div></main>'
    initMap()
    const check = document.querySelector('.no-js')
    expect(check).toEqual(null)
  })
})
