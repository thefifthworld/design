import axios from 'axios'
import debounce from 'lodash.debounce'
import slugify from 'slugify'
import config from '../../../config.json'
import {
  create,
  closest,
  nextMatching,
  hasClass,
  addClass,
  removeClass
} from '../../utils'

/**
 * Return the title, path, and parent fields, given an event object that is
 * targeted on something inside the same form.
 * @param event {Object} - An event object.
 * @returns {{ form: Element, title: Element|null, path: Element|null, parent:
 *   Element|null }|null} - Either an object with `title`, `path`, and `parent`
 *   properties, each providing the input Element for those fields, or `null`
 *   if no form could be found.
 */

const getFieldsFromEvent = event => {
  const form = closest(event.target, 'form')
  return form
    ? {
      form,
      title: form.querySelector('input[name="title"]'),
      path: form.querySelector('input[name="path"]'),
      parent: form.querySelector('input[name="parent"]')
    }
    : null
}

/**
 * Generate a default path based on the input fields given.
 * @param fields {{ title: Element, parent: Element }} - An object with `title`
 *   and `parent` properties, each the Element for that corresponding input
 *   field.
 * @returns {string|null} - The default path based on the current values of the
 *   `title` and `parent` fields, or `null` if no appropriate default path can
 *   be generated in their current state.
 */

const generateDefaultPath = fields => {
  const slug = fields.title && fields.title.value ? slugify(fields.title.value, { lower: true, strict: true }) : null
  const parent = fields.parent && fields.parent.value && fields.parent.value.startsWith('/') ? fields.parent.value : null
  return parent && slug ? `${parent}/${slug}` : slug ? `/${slug}` : ''
}

/**
 * Updates the `path` input field to the generated default if the input is
 * currently set to receive a default path value.
 * @param event {Object} - The event object.
 */

const updatePath = event => {
  const fields = getFieldsFromEvent(event)
  if (fields && fields.title && fields.path && fields.parent) {
    const defaultPath = generateDefaultPath({ title: fields.title, path: fields.path, parent: fields.parent })

    if (fields.path && hasClass(fields.path, 'use-default')) {
      fields.path.value = defaultPath
    }

    const path = fields.form ? fields.form.querySelector('p.path code') : null
    if (path) path.innerHTML = defaultPath
  }
}

/**
 * Update whether or not the path should be synced to the title and parent.
 * @param event {Object} - The event object that prompts the update.
 */

const updatePathSync = event => {
  const fields = getFieldsFromEvent(event)
  if (fields && fields.title && fields.path && fields.parent) {
    const defaultPath = generateDefaultPath({ title: fields.title, path: fields.path, parent: fields.parent })
    if (fields.path.value === defaultPath) {
      addClass(fields.path, 'use-default')
    } else {
      removeClass(fields.path, 'use-default')
    }
  }
}

/**
 * Clear the autocomplete options from a field.
 * @param field {Element} - The field that we're clearing autocomplete options
 *   away from.
 */

const clearAutocomplete = field => {
  const existing = nextMatching(field, 'ul.autocomplete')
  if (existing) existing.parentElement.removeChild(existing)
}

/**
 * Select an autocomplete option.
 * @param event {Object} - The event object that indicated that the user had
 *   made a selection.
 */

const selectAutocomplete = event => {
  const fields = getFieldsFromEvent(event)
  const item = closest(event.target, 'li')
  const { path } = item.dataset
  if (fields && fields.path && path) {
    fields.parent.value = path
    updatePath(event)
    clearAutocomplete(fields.parent)
  }
}

/**
 * Render autocomplete options.
 * @param res {[{ id: number, path: string, title: string }]} - An array of
 *   objects representing the autocomplete options to render.
 * @param field {Element} - The input field that we're rendering autocomplete
 *   options for.
 */

const renderAutocomplete = (res, field) => {
  clearAutocomplete(field)
  if (res.length > 0) {
    const list = create('ul', ['autocomplete'])
    res.forEach(row => {
      const item = create('li', null, { 'data-path': row.path, tabindex: 0 }, row.title)
      const path = create('span', ['url'], null, row.path)
      item.appendChild(path)
      list.appendChild(item)
      item.addEventListener('click', selectAutocomplete)
      item.addEventListener('keyup', event => {
        event.stopPropagation()
        if (event.keyCode === 13) selectAutocomplete(event)
      })
    })
    field.insertAdjacentElement('afterend', list)
  }
}

/**
 * Fetch and render autocomplete options.
 * @param field {Element} - The input field that we're providing autocomplete
 *   options for.
 * @returns {Promise<void>} - A Promise that resolves once autocomplete options
 *   have been fetched and rendered.
 */

const autocomplete = async field => {
  const q = field.value
  if (q.length > 3) {
    const url = `${config.apibase}/autocomplete`
    const query = {}
    if (q.startsWith('/')) {
      query.path = q
    } else {
      query.fragment = q
    }

    const res = await axios.post(url, query)
    renderAutocomplete(res.data.pages, field)
  } else {
    clearAutocomplete(field)
  }
}

/**
 * Hide the path field.
 * @param form {Element} - The form that the path field belongs to.
 */

const hidePath = form => {
  const fields = getFieldsFromEvent({ target: form })
  if (fields && fields.title && fields.path) {
    const id = fields.path.getAttribute('id')
    const pathLabel = id ? form.querySelector(`label[for="${id}"]`) : null
    if (pathLabel) addClass(pathLabel, 'visually-hidden')
    addClass(fields.path, 'visually-hidden')

    const p = create('p', ['path'])
    const em = create('em', null, null, 'Path:')
    const btn = create('button', ['path-toggle'], null, 'Edit')
    const code = create('code', null, null, path.value)
    p.appendChild(em)
    p.appendChild(code)
    p.appendChild(btn)
    fields.title.insertAdjacentElement('afterend', p)

    btn.addEventListener('click', event => {
      event.preventDefault()
      removeClass(pathLabel, 'visually-hidden')
      removeClass(fields.path, 'visually-hidden')
      p.parentNode.removeChild(p)
    })
  }
}

/**
 * Get all of the buttons that could submit a form, given one element inside
 * that form.
 * @param el {Element} - An element inside the form.
 * @returns {Element[]} - An array of all of the buttons that could submit the
 *   closest form to `el`, if `el` is indeed inside a form and any buttons
 *   could be found. If not, it simply returns an empty array.
 */

const getButtonsFromField = el => {
  const form = closest(el, 'form')
  const buttons = form ? Array.from(form.querySelectorAll('button:not(.path-toggle), input[type="submit"]')) : null
  return buttons && buttons.length > 0 ? buttons : []
}

/**
 * Disables all of the buttons that could submit a form, given an element
 * inside that form.
 * @param el {Element} - An element inside the form.
 */

const disableForm = el => {
  const buttons = getButtonsFromField(el)
  buttons.forEach(button => { button.setAttribute('disabled', 'disabled') })
}

/**
 * Enables all of the buttons that could submit a form, given an element
 * inside that form.
 * @param el {Eleemnt} - An element inside the form.
 */

const enableForm = el => {
  const buttons = getButtonsFromField(el)
  buttons.forEach(button => { button.removeAttribute('disabled') })
}

/**
 * Remove any existing error message about an invalid path.
 * @param el {Element} - The input field for the path.
 */

const removePathError = el => {
  enableForm(el)
  const err = nextMatching(el, 'p.error')
  if (err) err.parentElement.removeChild(err)
}

/**
 * Add an error message about an invalid path.
 * @param el {Element} - The input field for the path.
 * @param msg {string} - The error message to display.
 */

const addPathError = (el, msg) => {
  removePathError(el)
  disableForm(el)
  const p = create('p', ['error'])
  p.innerHTML = `Sorry, that won&rsquo;t work. ${msg}`
  el.insertAdjacentElement('afterend', p)
}

/**
 * Send the proposed path to the POST /checkpath endpoint to see if it will be
 * a valid path.
 * @param path {Element} - The input field for the path.
 * @returns {Promise<void>} - A Promise that resolves when the API has been
 *   called and its result used to either display an error message or remove
 *   any error message that might be presently displayed.
 */

const checkPath = async path => {
  const url = `${config.apibase}/checkpath`
  const res = await axios.post(url, { path: path.value })
  if (res.data.ok) {
    removePathError(path)
  } else {
    addPathError(path, res.data.error)
  }
}

/**
 * Initialize title, path & parent components.
 */

const initTitlePathParent = () => {
  const form = document.querySelector('.thefifthworld form.page, form.page.thefifthworld')
  const title = form.querySelector('input[name="title"]')
  const path = form.querySelector('input[name="path"]')
  const parent = form.querySelector('input[name="parent"]')

  if (title && path && parent) {
    // Set up default path behavior
    updatePathSync({ target: form })

    // Update default path when title or parent are changed
    title.addEventListener('keyup', event => {
      updatePath(event)
      updatePathSync(event)
    })

    // Let the user override the default path
    path.addEventListener('keyup', updatePathSync)

    // Provide autocomplete options for the parent field
    parent.addEventListener('keyup', event => {
      const db = debounce(() => autocomplete(event.target), 500)
      db()
      updatePath(event)
    })
    parent.addEventListener('blur', () => {
      setTimeout(() => {
        clearAutocomplete(parent)
      }, 100)
    })

    // Check path
    const debouncedCheckpath = debounce(checkPath, 1000)
    const checkPathOnTitleOrParent = () => { if (hasClass(path, 'use-default')) debouncedCheckpath(path) }
    title.addEventListener('keyup', checkPathOnTitleOrParent)
    parent.addEventListener('keyup', checkPathOnTitleOrParent)
    path.addEventListener('keyup', () => { debouncedCheckpath(path) })

    // Hide path
    hidePath(form)
  }
}

export default initTitlePathParent
