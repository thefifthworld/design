/* global describe, it, expect, jest */

import { ready } from './utils'

describe('ready', () => {
  it('runs if the document is ready', () => {
    const fn = jest.fn()
    ready(fn)
    expect(fn).toHaveBeenCalled()
  })
})
