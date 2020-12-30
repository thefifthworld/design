/* global describe, it, expect, Event */

import { select } from '../../utils'
import initLikes from './index'

describe('initLikes', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initLikes(select('.likes'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('registers your like', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p class="likes"><a href="/components.html" class="like" data-unlike="/templates.html">Like</a><span class="count">100< likes</span></p></main>'
    initLikes(select('.likes'))
    const btn = document.querySelector('a.like')
    btn.dispatchEvent(new Event('click'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p class="likes initialized"><a href="/templates.html" class="unlike" data-unlike="/templates.html" data-like="/components.html">Unlike</a><span class="count">101<span class="widont">&nbsp;</span>likes</span></p></main>')
  })

  it('lets you unlike', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p class="likes"><a href="/components.html" class="like" data-unlike="/templates.html">Like</a><span class="count">100 likes</span></p></main>'
    initLikes(select('.likes'))
    const btn = document.querySelector('a.like')
    btn.dispatchEvent(new Event('click'))
    btn.dispatchEvent(new Event('click'))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p class="likes initialized"><a href="/components.html" class="like" data-unlike="/templates.html" data-like="/components.html">Like</a><span class="count">100<span class="widont">&nbsp;</span>likes</span></p></main>')
  })
})
