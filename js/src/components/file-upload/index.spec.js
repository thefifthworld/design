/* global describe, it, expect */

import { select } from '../../utils'
import initFileUploads from './index'

const validFormSelector = 'form[action][method="POST"][enctype="multipart/form-data"]'
const inputSelector = `${validFormSelector} input[type="file"]:not(.initialized)`

describe('initFileUploads', () => {
  it('does nothing if there are no file inputs', () => {
    document.body.innerHTML = '<main class="thefifthworld"><p>Hello world!</p></main>'
    initFileUploads(validFormSelector, select(inputSelector))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><p>Hello world!</p></main>')
  })

  it('does nothing if there are is no form', () => {
    document.body.innerHTML = '<main class="thefifthworld"><input type="file"></main>'
    initFileUploads(validFormSelector, select(inputSelector))
    expect(document.body.innerHTML).toEqual('<main class="thefifthworld"><input type="file"></main>')
  })

  it('assigns an ID', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form action="#" method="POST" enctype="multipart/form-data"]><input type="file" /></form></main>'
    initFileUploads(validFormSelector, select(inputSelector))
    const input = document.querySelector('input[type="file"]')
    expect(input.getAttribute('id')).toEqual('file-upload-1')
  })

  it('removes the old label', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form action="#" method="POST" enctype="multipart/form-data"><label for="file">File</label><input type="file" id="file" /></form></main>'
    initFileUploads(validFormSelector, select(inputSelector))
    const label = document.querySelector('label[for="file"]')
    expect(label.innerHTML).not.toEqual('File')
  })

  it('adds the new label', () => {
    document.body.innerHTML = '<main class="thefifthworld"><form action="#" method="POST" enctype="multipart/form-data"><label for="file">File</label><input type="file" id="file" /></form></main>'
    initFileUploads(validFormSelector, select(inputSelector))
    const label = document.querySelector('label[for="file"]')
    expect(label.innerHTML).toEqual('<strong>Choose a file</strong> or drag it here')
  })
})
