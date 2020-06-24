/* global describe, it, expect, jest */

import {
  ready,
  select,
  closest,
  next,
  prev,
  nextMatching,
  prevMatching,
  create,
  remove,
  removeSelector,
  hasClass,
  addClass,
  removeClass,
  getLabel,
  setError
} from './utils'

describe('ready', () => {
  it('runs if the document is ready', () => {
    const fn = jest.fn()
    ready(fn)
    expect(fn).toHaveBeenCalled()
  })
})

describe('select', () => {
  it('returns elements that match the selector', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="test">Test</div></main>'
    const actual = select('.test')
    expect(actual).toHaveLength(1)
    expect(actual[0].outerHTML).toEqual('<div class="test">Test</div>')
  })

  it('doesn\'t return elements not in thefifthworld scope', () => {
    document.body.innerHTML = '<main><div class="test">Test</div></main>'
    const actual = select('.test')
    expect(actual).toHaveLength(0)
  })

  it('returns all matching elements by default', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="test">Test #1</div><div class="test">Test #2</div></main>'
    const actual = select('.test')
    expect(actual).toHaveLength(2)
  })

  it('returns only the first matching element when told to', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="test">Test #1</div><div class="test">Test #2</div></main>'
    const actual = select('.test', false)
    expect(actual).toHaveLength(1)
    expect(actual[0].innerHTML).toEqual('Test #1')
  })
})

describe('closest', () => {
  it('returns the element itself if it matches', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="outer"><div class="inner" id="start">Hello world</div></div></main>'
    const actual = closest(document.getElementById('start'), '.inner')
    expect(actual.innerHTML).toEqual('Hello world')
  })

  it('returns the closest element that matches', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="outer"><div class="inner" id="start">Hello world</div></div></main>'
    const actual = closest(document.getElementById('start'), '.thefifthworld')
    expect(actual.tagName.toLowerCase()).toEqual('main')
  })

  it('returns null if nothing matches', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="outer" data-tag="outer"><div class="inner" id="start">Hello world</div></div></main>'
    const actual = closest(document.getElementById('start'), '.nope')
    expect(actual).toEqual(null)
  })
})

describe('next', () => {
  it('returns the next element', () => {
    document.body.innerHTML = '<div id="el1"></div><div id="el2"></div>'
    const el = document.getElementById('el1')
    expect(next(el).getAttribute('id')).toEqual('el2')
  })

  it('returns null if there is no next element', () => {
    document.body.innerHTML = '<div id="el1"></div><div id="el2"></div>'
    const el = document.getElementById('el2')
    expect(next(el)).toEqual(null)
  })
})

describe('prev', () => {
  it('returns the prrebious element', () => {
    document.body.innerHTML = '<div id="el1"></div><div id="el2"></div>'
    const el = document.getElementById('el2')
    expect(prev(el).getAttribute('id')).toEqual('el1')
  })

  it('returns null if there is no prebious element', () => {
    document.body.innerHTML = '<div id="el1"></div><div id="el2"></div>'
    const el = document.getElementById('el1')
    expect(prev(el)).toEqual(null)
  })
})

describe('nextMatching', () => {
  it('returns the next matching sibling', () => {
    document.body.innerHTML = '<div id="anchor"></div><p>1</p><p class="target">2</p>'
    const el = document.getElementById('anchor')
    expect(nextMatching(el, '.target').innerHTML).toEqual('2')
  })

  it('returns undefined if nothing matches', () => {
    document.body.innerHTML = '<div id="anchor"></div><p>1</p><p>2</p>'
    const el = document.getElementById('anchor')
    expect(nextMatching(el, '.target')).toEqual(undefined)
  })
})

describe('prevMatching', () => {
  it('returns the previous matching sibling', () => {
    document.body.innerHTML = '<p class="target">1</p><p>2</p><div id="anchor"></div>'
    const el = document.getElementById('anchor')
    expect(prevMatching(el, '.target').innerHTML).toEqual('1')
  })

  it('returns undefined if nothing matches', () => {
    document.body.innerHTML = '<p>1</p><p>2</p><div id="anchor"></div>'
    const el = document.getElementById('anchor')
    expect(prevMatching(el, '.target')).toEqual(undefined)
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

describe('hasClass', () => {
  it('returns true if the element has the class', () => {
    const el = create('div', ['test'])
    expect(hasClass(el, 'test')).toEqual(true)
  })

  it('returns false if the element does not have the class', () => {
    const el = create('div', ['somethingelse'])
    expect(hasClass(el, 'test')).toEqual(false)
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
    const el = create('div', ['test1'])
    addClass(el, 'test1', 'test2')
    expect(el.outerHTML).toEqual('<div class="test1 test2"></div>')
  })
})

describe('removeClass', () => {
  it('removes a class', () => {
    const el = create('div', ['test'])
    removeClass(el, 'test')
    expect(el.outerHTML).toEqual('<div class=""></div>')
  })

  it('removes multiple classes', () => {
    const el = create('div', ['test1', 'test2', 'test3'])
    removeClass(el, 'test1', 'test2')
    expect(el.outerHTML).toEqual('<div class="test3"></div>')
  })
})

describe('getLabel', () => {
  it('returns the label', () => {
    document.body.innerHTML = '<label for="test">Label</label><input id="test" />'
    expect(getLabel(document.getElementById('test')).innerHTML).toEqual('Label')
  })

  it('returns null if there is no label', () => {
    document.body.innerHTML = '<label>Label</label><input id="test" />'
    expect(getLabel(document.getElementById('test'))).toEqual(null)
  })
})

describe('setError', () => {
  it('sets the error state on the field and its label', () => {
    document.body.innerHTML = '<label for="test">Label</label><input id="test" />'
    const input = document.getElementById('test')
    const label = getLabel(input)
    setError(input)
    expect(hasClass(input, 'error')).toEqual(true)
    expect(hasClass(label, 'error')).toEqual(true)
  })

  it('just sets the error state on the field if it has no label', () => {
    document.body.innerHTML = '<label id="label">Label</label><input id="test" />'
    const input = document.getElementById('test')
    const label = document.getElementById('label')
    setError(input)
    expect(hasClass(input, 'error')).toEqual(true)
    expect(hasClass(label, 'error')).toEqual(false)
  })
})
