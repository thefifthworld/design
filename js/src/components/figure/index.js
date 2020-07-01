import { create, removeClass } from '../../utils'

/**
 * Initialize figures that should be numbered.
 * @param captions {Element[]} - The figure captions that should be numbered.
 */

const initFigures = captions => {
  captions.forEach((caption, index) => {
    const num = index + 1
    const fig = create('strong', null, null, `Figure ${num}.`)
    caption.innerHTML = fig.outerHTML + ' ' + caption.innerHTML
    removeClass(caption, 'numbered')
    if (caption.className === '') caption.removeAttribute('class')
  })
}

export default initFigures
