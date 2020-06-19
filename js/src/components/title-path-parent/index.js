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

const generateDefaultPath = fields => {
  const slug = fields.title && fields.title.value ? slugify(fields.title.value, { lower: true }) : null
  const parent = fields.parent && fields.parent.value && fields.parent.value.startsWith('/') ? fields.parent.value : null
  return parent ? `${parent}/${slug}` : `/${slug}`
}

const updatePath = fields => {
  const defaultPath = generateDefaultPath(fields)
  if (fields.path && hasClass(fields.path, 'use-default')) {
    fields.path.value = defaultPath
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
  const { path } = event.target.dataset
  const list = closest(event.target, 'ul.autocomplete')
  const field = list ? prevMatching(list, 'input[name="parent"]') : null
  if (field && path) {
    field.value = path
    clearAutocomplete(field)
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
 * Initialize title, path & parent components.
 */

const initTitlePathParent = () => {
  const form = document.querySelector('.thefifthworld form.page, form.page.thefifthworld')
  const title = form.querySelector('input[name="title"]')
  const path = form.querySelector('input[name="path"]')
  const parent = form.querySelector('input[name="parent"]')

  if (title && path && parent) {
    const defaultPath = generateDefaultPath({ title, path, parent })
    if (path.value === '' || defaultPath === path.value) {
      path.value = defaultPath
      addClass(path, 'use-default')
    }

    title.addEventListener('keyup', () => updatePath({ title, path, parent }))
    parent.addEventListener('keyup', event => {
      const db = debounce(() => autocomplete(event.target), 500)
      db()
    })
    parent.addEventListener('change', () => updatePath({ title, path, parent }))
    path.addEventListener('keyup', () => {
      const defaultPath = generateDefaultPath({ title, path, parent })
      if (path.value === defaultPath) {
        addClass(path, 'use-default')
      } else {
        removeClass(path, 'use-default')
      }
    })
  }
}

export default initTitlePathParent
