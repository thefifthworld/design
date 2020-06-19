import axios from 'axios'
import debounce from 'lodash.debounce'
import slugify from 'slugify'
import config from '../../../config.json'
import {
  create,
  closest,
  nextMatching,
  prevMatching,
  hasClass,
  addClass,
  removeClass
} from '../../utils'

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
  return parent && slug ? `${parent}/${slug}` : slug ? `/${slug}` : null
}

/**
 * Updates the `path` input field to the generated default if the input is
 * currently set to receive a default path value.
 * @param form {Element} - The form element that the fields belong to.
 * @param fields {{ title: Element, path: Element, parent: Element }}- An
 *   object with `title`, `path`, and `parent` properties, all pointing to the
 *   appropriate input fields.
 */

const updatePath = (form, fields) => {
  const defaultPath = generateDefaultPath(fields)

  if (fields.path && hasClass(fields.path, 'use-default')) {
    fields.path.value = defaultPath
  }

  const path = form.querySelector('p.path code')
  if (path) path.innerHTML = defaultPath
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
  const item = closest(event.target, 'li')
  const { path } = item.dataset
  const list = closest(item, 'ul.autocomplete')
  const field = list ? prevMatching(list, 'input[name="parent"]') : null
  if (field && path) {
    field.value = path
    clearAutocomplete(field)
  }

  const form = closest(field, 'form')
  if (form) {
    const title = form.querySelector('input[name="title"]')
    const path = form.querySelector('input[name="path"]')
    if (title && path) {
      updatePath(form, { title, path, parent: field })
    }
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

const hidePath = (form, title, path) => {
  const id = path.getAttribute('id')
  const label = id ? form.querySelector(`label[for="${id}"]`) : null
  if (label) addClass(label, 'visually-hidden')
  addClass(path, 'visually-hidden')

  const p = create('p', ['path'])
  const em = create('em', null, null, 'Path:')
  const btn = create('button', null, null, 'Edit')
  const code = create('code', null, null, path.value)
  p.appendChild(em)
  p.appendChild(code)
  p.appendChild(btn)
  title.insertAdjacentElement('afterend', p)

  btn.addEventListener('click', event => {
    event.preventDefault()
    removeClass(label, 'visually-hidden')
    removeClass(path, 'visually-hidden')
    p.parentNode.removeChild(p)
  })
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
    const defaultPath = generateDefaultPath({ title, path, parent })
    if (path.value === '' || defaultPath === path.value) {
      path.value = defaultPath
      addClass(path, 'use-default')
    }

    // Update default path when title or parent are changed
    title.addEventListener('keyup', () => updatePath(form, { title, path, parent }))

    // Let the user override the default path
    path.addEventListener('keyup', () => {
      const defaultPath = generateDefaultPath({ title, path, parent })
      if (path.value === defaultPath) {
        addClass(path, 'use-default')
      } else {
        removeClass(path, 'use-default')
      }
    })

    // Provide autocomplete options for the parent field
    parent.addEventListener('keyup', event => {
      const db = debounce(() => autocomplete(event.target), 500)
      db()
      updatePath(form, { title, path, parent })
    })

    // Hide path
    hidePath(form, title, path)
  }
}

export default initTitlePathParent
