/* global describe, it, expect, jest */

import { ready, create, remove } from './utils'

describe('ready', () => {
  it('runs if the document is ready', () => {
    const fn = jest.fn()
    ready(fn)
    expect(fn).toHaveBeenCalled()
  })
})

describe('create', () => {
  it('creates a node', () => {
    const actual = create()
    expect(actual.outerHTML).toEqual('<div></div>')
  })

  it('creates a node of specified tag', () => {
    const actual = create('p')
    expect(actual.outerHTML).toEqual('<p></p>')
  })

  it('creates a node with the given classes', () => {
    const actual = create(undefined, ['test1', 'test2'])
    expect(actual.outerHTML).toEqual('<div class="test1 test2"></div>')
  })

  it('applies other attributes', () => {
    const actual = create(undefined, undefined, { id: 'test' })
    expect(actual.outerHTML).toEqual('<div id="test"></div>')
  })

  it('applies text', () => {
    const actual = create(undefined, undefined, undefined, 'Test')
    expect(actual.outerHTML).toEqual('<div>Test</div>')
  })

  it('does it all at once', () => {
    const actual = create('p', ['test1', 'test2'], { id: 'test' }, 'Test')
    expect(actual.outerHTML).toEqual('<p class="test1 test2" id="test">Test</p>')
  })
})

describe('remove', () => {
  it('removes an element', () => {
    document.body.innerHTML = '<main><div id="test">Test</div><p>Hello world!</p></main>'
    remove(document.getElementById('test'))
    expect(document.body.innerHTML).toEqual('<main><p>Hello world!</p></main>')
  })
})
