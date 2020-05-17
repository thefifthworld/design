/**
 * Run a function when the DOM is ready.
 * @param fn {function} - The function that will be run when the DOM is ready.
 */

const ready = fn => {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

/**
 * Create a Node.
 * @param tag {string=} - The name of the tag to use (e.g., `div`, `section`,
 *   `aside`, `p`, etc.) (Default: `div`).
 * @param classes {?string[]} - An array of strings to add to the node as
 *   classes.
 * @param attrs {?{}} - An object that provides attributes to add to the node,
 *   expressed as key/value pairs.
 * @param text {?string} - A string to add as the Node as a text node child.
 * @returns {Node} - A Node matching the paramaters given.
 */

const create = (tag = 'div', classes, attrs, text) => {
  const el = document.createElement(tag)
  if (classes) el.setAttribute('class', classes.join(' '))
  if (attrs) Object.keys(attrs).forEach(attr => { el.setAttribute(attr, attrs[attr]) })
  if (text) { const node = document.createTextNode(text); el.appendChild(node) }
  return el
}

/**
 * Removes an element from the DOM.
 * @param el {Element} - The element to remove from the DOM.
 */

const remove = el => {
  el.parentElement.removeChild(el)
}

/**
 * Remove all elements from the DOM that match the given selector.
 * @param selector {string} - The selector string for the elements to remove
 *   from the DOM.
 * @param el {Node=} - (Optional.) A parent element. If provided, only those
 *   elements which descend from this node will be removed.
 */

const removeSelector = (selector, el = document) => {
  const els = Array.from(el.querySelectorAll(selector))
  if (els) { els.forEach(el => { remove(el) }) }
}

/**
 * Tests if an element has a partciular class.
 * @param el {Element} - The element to test.
 * @param className {string} - The class to test for.
 * @returns {boolean} - `true` if `el` has the class `className`, or `false`
 *   if it does not.
 */

const hasClass = (el, className) => {
  const classes = el.classList ? Array.from(el.classList) : el.className.split(' ')
  return classes.includes(className)
}

/**
 * Add one or more classes to an element.
 * @param el {Element} - The element to add the classes to.
 * @param classes {string} - The classes to add to the element.
 */

const addClass = (el, ...classes) => {
  classes.forEach(className => {
    if (el.classList) {
      el.classList.add(className)
    } else {
      const curr = el.className.split(' ')
      if (!curr.includes(className)) {
        el.className += ` ${className}`
      }
    }
  })
}

/**
 * Removes one or more classes from an element.
 * @param el {Element} - The element to remove the classes from.
 * @param classes {string} - The classes to remove from the element.
 */

const removeClass = (el, ...classes) => {
  classes.forEach(className => {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      const curr = el.className.split(' ')
      el.className = curr.filter(cls => cls !== className).join(' ')
    }
  })
}

/**
 * Wraps a geolocation request in a Promise.
 * @param opts {Object} - Options to pass to the geolocation request.
 * @returns {Promise<unknown>} - A Promise that resolves with the result of a
 *   geolocation request.
 */

const requestLocation = opts => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, opts)
  })
}

export {
  ready,
  create,
  remove,
  removeSelector,
  hasClass,
  addClass,
  removeClass,
  requestLocation
}
