/* global describe, it, expect, jest */

import {
  ready,
  create,
  remove,
  removeSelector,
  addClass
} from './utils'

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

describe('removeSelector', () => {
  it('removes an element', () => {
    document.body.innerHTML = '<main><div id="test">Test</div><p>Hello world!</p></main>'
    removeSelector('#test')
    expect(document.body.innerHTML).toEqual('<main><p>Hello world!</p></main>')
  })

  it('removes multiple elements', () => {
    document.body.innerHTML = '<main><div class="test">Test</div><div class="test">Test</div><p>Hello world!</p></main>'
    removeSelector('.test')
    expect(document.body.innerHTML).toEqual('<main><p>Hello world!</p></main>')
  })

  it('removes only those elements that descend from the given node', () => {
    document.body.innerHTML = '<main><div class="parent"><div class="test">Test</div></div><div class="test">Test</div><p>Hello world!</p></main>'
    const el = document.querySelector('.parent')
    removeSelector('.test', el)
    expect(document.body.innerHTML).toEqual('<main><div class="parent"></div><div class="test">Test</div><p>Hello world!</p></main>')
  })
})

describe('addClass', () => {
  it('adds a class', () => {
    const el = create()
    addClass(el, 'test')
    expect(el.outerHTML).toEqual('<div class="test"></div>')
  })

  it('adds multiple classes', () => {
    const el = create()
    addClass(el, 'test1', 'test2')
    expect(el.outerHTML).toEqual('<div class="test1 test2"></div>')
  })

  it('doesn\'t duplicate classes', () => {
    const el = create('div', [ 'test1' ])
    addClass(el, 'test1', 'test2')
    expect(el.outerHTML).toEqual('<div class="test1 test2"></div>')
  })
})
