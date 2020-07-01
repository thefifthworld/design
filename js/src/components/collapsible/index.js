import { select, create, next, addClass, removeClass, hasClass } from '../../utils'

/**
 * Collapse a togglable content wrapper.
 * @param wrapper {Element} - The togglable content wrapper to collapse.
 */

const collapse = wrapper => {
  const h = wrapper.scrollHeight
  const transition = wrapper.style.transition
  wrapper.style.transition = ''

  requestAnimationFrame(() => {
    wrapper.style.height = `${h}px`
    wrapper.style.transition = transition

    requestAnimationFrame(() => {
      wrapper.style.height = '0px'
    })
  })
}

/**
 * Expand a togglable content wrapper.
 * @param wrapper {Element} - The togglable content wrapper to expand.
 */

const expand = wrapper => {
  const h = wrapper.scrollHeight
  wrapper.style.height= `${h}px`

  const onTransitionEnd = () => {
    wrapper.removeEventListener('transitionend', onTransitionEnd)
    wrapper.style.height = null
  }

  wrapper.addEventListener('transitionend', onTransitionEnd)
}

/**
 * Event handler for clicking on the toggle handle.
 * @param event {Object} - The event object.
 */

const handleToggle = event => {
  const heading = event.target
  const n = next(heading)
  const wrapper = n && hasClass(n, 'togglable') ? n : null
  if (heading && wrapper && hasClass(heading, 'open')) {
    removeClass(heading, 'open')
    collapse(wrapper)
  } else if (heading && wrapper && !hasClass(heading, 'open')) {
    addClass(heading, 'open')
    expand(wrapper)
  }
}

/**
 * Initialize collapsible components
 * @param collapsibles {Element[]} - An array of elements to initialize with
 *   collapsible behavior.
 */

const initCollapsibles = (collapsibles) => {
  collapsibles.forEach(collapsible => {
    const heading = collapsible.querySelector('h1, h2, h3, h4, h5, h6')
    if (heading) {
      const toggle = create(heading.tagName.toLowerCase(), ['toggle'], undefined, heading.innerHTML)
      const wrapper = create('div', ['togglable'])
      collapsible.childNodes.forEach(child => {
        if (child !== heading) {
          wrapper.appendChild(child.cloneNode(true))
        }
      })

      collapsible.innerHTML = ''
      collapsible.appendChild(toggle)
      collapsible.appendChild(wrapper)
      toggle.addEventListener('click', handleToggle)
      wrapper.style.height = '0px'
    }
  })
}

export default initCollapsibles
