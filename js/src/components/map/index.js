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
      map.setView([ 0, 0 ], 3)
      leaflet.tileLayer('http://b.tile.stamen.com/terrain-background/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        maxZoom: 18
      }).addTo(map)
    })
  }
}

export default initMap
