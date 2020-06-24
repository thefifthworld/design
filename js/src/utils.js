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
 * Returns an array of those elements within the `.thefifthworld` scope that
 * match the given selector.
 * @param selector {string} - The selector to find.
 * @param all {boolean=} - Optional. If `true`, returns all of the elements
 *   that match the given selector. If not, only returns the first one
 *   (Default: `true`).
 * @returns {Element[]} - An array of matching elements.
 */

const select = (selector, all = true) => {
  const s = `.thefifthworld ${selector}`
  if (all) {
    return Array.from(document.querySelectorAll(s))
  } else {
    return [document.querySelector(s)].filter(e => e !== null)
  }
}

/**
 * Finds the nearest ancestor of the given element that matches the given
 * selector.
 * @param el {Element} - The element to search from.
 * @param selector {string} - The selector to search for.
 * @returns {Element|null} = Returns the nearest ancestor of `el` that matches
 *   `selector` if one exists. If it does not exist, returns `null`.
 */

const closest = (el, selector) => {
  if (el.matches && el.matches(selector)) {
    return el
  } else if (el.parentNode) {
    return closest(el.parentNode, selector)
  } else {
    return null
  }
}

/**
 * Return the next element sibling of the element provided.
 * @param el {Element} - The element to begin with.
 * @returns {Element|null} - The next element sibling of the element given, or
 *   `null` if no such element could be found.
 */

const next = el => {
  function nextElementSibling (el) {
    do { el = el.nextSibling; } while ( el && el.nodeType !== 1 )
    return el
  }

  return el.nextElementSibling || nextElementSibling(el)
}

/**
 * Return the previous element sibling of the element provided.
 * @param el {Element} - The element to begin with.
 * @returns {Element|null} - The previous element sibling of the element given,
 *   or `null` if no such element could be found.
 */

const prev = el => {
  function previousElementSibling (el) {
    do { el = el.previousSibling; } while ( el && el.nodeType !== 1 )
    return el
  }

  return el.previousElementSibling || previousElementSibling(el)
}

/**
 * Return the next sibling of `el` that matches the selector `selector`.
 * @param el {Element} - The element to begin searching from.
 * @param selector {string} - The selector that the sibling should match.
 * @returns {Element|undefined} - The next sibling from `el` that matches the
 *   given selector, or `undefined` if no such sibling could be found.
 */

const nextMatching = (el, selector) => {
  const n = next(el)
  if (n && n.matches(selector)) {
    return n
  } else if (n) {
    return nextMatching(n, selector)
  } else {
    return undefined
  }
}

/**
 * Return the previous sibling of `el` that matches the selector `selector`.
 * @param el {Element} - The element to begin searching from.
 * @param selector {string} - The selector that the sibling should match.
 * @returns {Element|undefined} - The previous sibling from `el` that matches
 *   the given selector, or `undefined` if no such sibling could be found.
 */

const prevMatching = (el, selector) => {
  const p = prev(el)
  if (p && p.matches(selector)) {
    return p
  } else if (p) {
    return prevMatching(p, selector)
  } else {
    return undefined
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
 * Return the `label` element connected to the given `input` element via its
 * `for` attribute.
 * @param input {Element} - An input element.
 * @returns {Element|null} - The `label` element that is connected to the given
 *   `input` element via its `for` attribute, or `null` if no such label could
 *   be found.
 */

const getLabel = input => {
  const id = input.getAttribute('id')
  return id ? document.querySelector(`label[for="${id}"]`) : null
}

/**
 * Add the `error` class to an input and its label (if its label can be found).
 * @param input {Element} - The input that should have the `error` class added.
 */

const setError = input => {
  const label = getLabel(input)
  if (label) addClass(label, 'error')
  addClass(input, 'error')
}

/**
 * Removes the `error` class from an input and its label (if its label can be
 * found).
 * @param input {Element} - The input that should have the `error` class
 *   removed.
 */

const removeError = input => {
  const label = getLabel(input)
  if (label) removeClass(label, 'error')
  removeClass(input, 'error')
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
  select,
  closest,
  next,
  prev,
  nextMatching,
  prevMatching,
  create,
  remove,
  removeSelector,
  hasClass,
  addClass,
  removeClass,
  getLabel,
  setError,
  removeError,
  requestLocation
}
