/* global describe, it, expect */

import initPageForm from './index'

const init = () => {
  const form = document.querySelector('.thefifthworld form.page, form.page.thefifthworld')
  const title = form ? form.querySelector('input[name="title"]') : null
  const path = form ? form.querySelector('input[name="path"]') : null
  const parent = form ? form.querySelector('input[name="parent"]') : null
  if (form && title && path && parent) {
    initPageForm(form, title, path, parent)
  }
}

describe('initPageForm', () => {
  it('does nothing if it has no entry point', () => {
    document.body.innerHTML = '<main class="thefifthworld"></main>'
    init()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"></main>')
  })

  it('hides the path by default', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form class="page"><label for="title">Title</label><input id="title" name="title" type="text" /><label for="path">Path</label><input id="path" name="path" type="text" /><label for="parent">Parent</label><input id="parent" name="parent" type="text" /></form></main>'
    init()
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><form class="page"><label for="title">Title</label><input id="title" name="title" type="text"><p class="path"><em>Path:</em><code></code><button class="path-toggle">Edit</button></p><label for="path" class="visually-hidden">Path</label><input id="path" name="path" type="text" class="use-default visually-hidden"><label for="parent">Parent</label><input id="parent" name="parent" type="text"></form></main>')
  })

  it('updates the path when you update the title', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form class="page"><label for="title">Title</label><input id="title" name="title" type="text" /><label for="path">Path</label><input id="path" name="path" type="text" /><label for="parent">Parent</label><input id="parent" name="parent" type="text" /></form></main>'
    init()
    const title = document.getElementById('title')
    const path = document.getElementById('path')
    title.value = 'This is a test.'
    title.dispatchEvent(new Event('keyup'))
    expect(path.value).toEqual('/this-is-a-test')
  })

  it('updates the path when you update the parent', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form class="page"><label for="title">Title</label><input id="title" name="title" type="text" /><label for="path">Path</label><input id="path" name="path" type="text" /><label for="parent">Parent</label><input id="parent" name="parent" type="text" /></form></main>'
    init()
    const title = document.getElementById('title')
    const parent = document.getElementById('parent')
    const path = document.getElementById('path')
    title.value = 'This is also a test.'
    title.dispatchEvent(new Event('keyup'))
    parent.value = '/this-is-a-test'
    parent.dispatchEvent(new Event('keyup'))
    expect(path.value).toEqual('/this-is-a-test/this-is-also-a-test')
  })
})
