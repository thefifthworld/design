import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { ready, select } from './utils'
import { initTypography } from './typography'

/**
 * Abstract dynamic import method.
 * @param selector {string} - The selector which, if present, would indicate
 *   that the module should be loaded.
 * @param component {string} - The name of the module to load if any elements
 *   with the given selector are present.
 * @returns {Promise<void>} - If any elements matching the given selector are
 *   present, this Promise resolves once the appropriate module has been loaded
 *   and initialized with an array of those elements. If no such elements are
 *   present, the Promise resolves immediately.
 */

const initComponent = async (selector, component) => {
  const elems = select(selector)
  if (elems && elems.length > 0) {
    const init = (await import(`./components/${component}`)).default
    init(elems)
  }
}

/**
 * Check to see if there are any file input elements, and if so, load the file
 * input module and initialize it with those inputs.
 * @returns {Promise<void>} - A Promise that resolves once the file input
 *   module has been loaded and initialized with an array of appropriate file
 *   input elements, if any are found, or immediately if none were.
 */

const initFileUploads = async () => {
  const validFormSelector = 'form[action][method="POST"][enctype="multipart/form-data"]'
  const inputs = select(`${validFormSelector} input[type="file"]:not(.initialized)`)
  if (inputs && inputs.length > 0) {
    const init = (await import('./components/file-upload')).default
    init(validFormSelector, inputs)
  }
}

/**
 * Check to see if there are any title/path/parent input element sets, and if
 * so, load the title/parent/path module and initialize it with those inputs.
 * @returns {Promise<void>} - A Promise that resolves once the title/parent/
 *   path input module has been loaded and initialized if all of the necessary
 *   elements are present, or immediately if they are not.
 */

const initTitlePathParent = async () => {
  const form = document.querySelector('.thefifthworld form.page, form.page.thefifthworld')
  const title = form ? form.querySelector('input[name="title"]') : null
  const path = form ? form.querySelector('input[name="path"]') : null
  const parent = form ? form.querySelector('input[name="parent"]') : null
  if (form && title && path && parent) {
    const init = (await import('./components/title-path-parent')).default
    init(form, title, path, parent)
  }
}

ready(async () => {
  initTypography() // There's always text.

  // Common components
  initComponent('.collapsible', 'collapsible')
  initComponent('figcaption.numbered', 'figure')
  initComponent('.jump-to-nav', 'jump-to-nav')
  initComponent('.likes', 'like-unlike')
  initComponent('.leaflet-wrapper', 'map')

  // Components that take a little more specialized attention to properly load
  initFileUploads()
  initTitlePathParent()
})
