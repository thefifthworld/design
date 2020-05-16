import leaflet from 'leaflet'
import { removeSelector, addClass } from '../../utils'

const initMap = () => {
  removeSelector('.leaflet-wrapper .no-js')
  const wrappers = Array.from(document.querySelectorAll('.leaflet-wrapper'))
  if (wrappers) {
    wrappers.forEach((wrapper, index) => {
      const id = `leaflet-wrapper-${index}`
      wrapper.setAttribute('id', id)
      addClass(wrapper, 'initialized')
      const map = leaflet.map(id)
      map.setView(0, 0, 13)
    })
  }
}

export default initMap
