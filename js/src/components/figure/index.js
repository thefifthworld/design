import { select, create, removeClass } from '../../utils'

const initFigures = () => {
  const captions = select('figcaption.numbered')
  captions.forEach((caption, index) => {
    const num = index + 1
    const fig = create('strong', null, null, `Figure ${num}.`)
    caption.innerHTML = fig.outerHTML + ' ' + caption.innerHTML
    removeClass(caption, 'numbered')
    if (caption.className === '') caption.removeAttribute('class')
  })
}

export default initFigures
