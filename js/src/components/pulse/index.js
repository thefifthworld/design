import { addClass } from '../../utils'

/**
 * Initialize pulse component.
 * @param elems {Element[]} - Elements that invoke the pulse component.
 */

const initPulse = elems => {
  const el = elems && Array.isArray(elems) && elems.length > 0 ? elems[0] : null
  if (el) {
    addClass(el, 'initialized')
  }
}

export default initPulse
