import { select, create } from '../../utils'

const initFigures = () => {
  console.log('initFigures')
  const captions = select('figcaption.numbered')
  console.log(captions)
  captions.forEach((caption, index) => {
    const num = index + 1
    const fig = create('strong', null, null, `Figure ${num}.`)
    caption.innerHTML = fig.outerHTML + ' ' + caption.innerHTML
  })
}

export default initFigures
