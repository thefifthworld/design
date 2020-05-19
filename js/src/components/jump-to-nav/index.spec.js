/* global describe, it, expect */

import initJumpToNav from './index'

describe('initJumpToNav', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initJumpToNav()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('inserts nav', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="jump-to-nav"></div><section id="test"><h1>Test</h1></section></main>'
    initJumpToNav()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><div class="jump-to-nav"><label for="jump-to-nav">Jump to</label><select class="jump-to-nav" id="jump-to-nav"><option value="test">Test</option></select></div><section id="test"><h1>Test</h1></section></main>')
  })

  it('doesn\'t create multiple navs', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="jump-to-nav"></div><section id="test"><h1>Test</h1></section></main>'
    initJumpToNav()
    initJumpToNav()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><div class="jump-to-nav"><label for="jump-to-nav">Jump to</label><select class="jump-to-nav" id="jump-to-nav"><option value="test">Test</option></select></div><section id="test"><h1>Test</h1></section></main>')
  })

  it('categorizes', () => {
    document.body.innerHTML = '<main class="thefifthworld"><div class="jump-to-nav"></div><section id="test" data-category="Test"><h1>Test</h1></section></main>'
    initJumpToNav()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><div class="jump-to-nav"><label for="jump-to-nav">Jump to</label><select class="jump-to-nav" id="jump-to-nav"><optgroup label="Test"><option value="test">Test</option></optgroup></select></div><section id="test" data-category="Test"><h1>Test</h1></section></main>')
  })
})
