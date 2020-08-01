import { create } from '../../utils'

/**
 * Finds the sections on the page that one could jump to, and assembles an
 * object reporting that data.
 * @returns {{uncategorized: [{ id: string, label: string }], categories: {}}} -
 *   `uncategorized` is an array of objects. `categories` is an object where
 *   each property is a separate category, assigned to an array of such
 *   objects.
 */

const getOptions = () => {
  const main = document.querySelector('main')
  const sections = main ? Array.from(main.children).filter(n => n.tagName.toLowerCase() === 'section') : []

  const uncategorized = []
  const categories = {}
  sections.forEach(section => {
    const heading = section.querySelector('h1, h2, h3, h4, h5')
    const id = section.getAttribute('id')
    const label = heading ? heading.textContent : null
    const option = id && label ? { id, label } : false
    const category = section.dataset ? section.dataset.category : false
    if (category && !Array.isArray(categories[category])) categories[category] = []
    const arr = category ? categories[category] : uncategorized
    if (option) arr.push(option)
  })

  return { uncategorized, categories }
}

/**
 * This is the event responder function for the jump-to navigation. It jumps
 * to the part of the page indicated by the selection.
 * @param event {Event} - The event object.
 */

const onClick = event => {
  window.location.href = `#${event.target.value}`
}

/**
 * Initializes jump-to navigation.
 * @param wrappers {Element[]} - An array of elements that are requesting a
 *   jump-to navigation element.
 */

const initJumpToNav = wrappers => {
  const wrapper = wrappers && wrappers.length > 0 ? wrappers[0] : null
  const initialized = wrapper ? wrapper.querySelector('select.jump-to-nav') !== null : false
  if (wrapper && !initialized) {
    const { uncategorized, categories } = getOptions()
    const select = create('select', ['jump-to-nav'], { id: 'jump-to-nav' })
    const label = create('label', null, { for: 'jump-to-nav' }, 'Jump to')

    // Add uncategorized options.
    uncategorized.forEach(option => {
      const el = create('option', undefined, { value: option.id }, option.label)
      select.appendChild(el)
    })

    // Add optgroups for each category.
    Object.keys(categories).forEach(label => {
      const optgroup = create('optgroup', undefined, { label })
      categories[label].forEach(option => {
        const el = create('option', undefined, { value: option.id }, option.label)
        optgroup.appendChild(el)
      })
      select.appendChild(optgroup)
    })

    select.addEventListener('change', onClick)
    wrapper.appendChild(label)
    wrapper.appendChild(select)
  }
}

export default initJumpToNav
