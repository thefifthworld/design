import axios from 'axios'
import debounce from 'lodash.debounce'
import config from '../../../config.json'
import { create, closest, nextMatching, prevMatching } from '../../utils'

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
    const item = create('li', null, { 'data-path': row.path }, row.title)
    const path = create('span', ['url'], null, row.path)
    item.appendChild(path)
    list.appendChild(item)
    item.addEventListener('click', selectAutocomplete)
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
    parent.addEventListener('keyup', event => {
      const db = debounce(() => autocomplete(event.target), 500)
      db()
    })
  }
}

export default initTitlePathParent
