import leaflet from 'leaflet'
import { removeSelector, addClass, hasClass, requestLocation } from '../../utils'

const initMap = async () => {
  removeSelector('.leaflet-wrapper .no-js')
  const wrappers = Array.from(document.querySelectorAll('.leaflet-wrapper'))
  const worldWrapper = document.querySelector('.leaflet-wrapper.world')
  const promptLocation = Boolean(worldWrapper)

  let center = [ 0, 0 ]
  if (promptLocation) {
    try {
      const pos = await requestLocation()
      center = [ pos.coords.latitude, pos.coords.longitude ]
    } catch {
      center = [ 0, 0 ]
    }
  }

  if (wrappers) {
    wrappers.forEach((wrapper, index) => {
      const id = `leaflet-wrapper-${index}`
      wrapper.setAttribute('id', id)
      addClass(wrapper, 'initialized')
      const map = leaflet.map(id)
      const zoom = center.toString() === '0,0' ? 3 : 14
      console.log(center, zoom)
      map.setView(center, zoom)
      leaflet.tileLayer('http://b.tile.stamen.com/terrain-background/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        maxZoom: 18
      }).addTo(map)
    })
  }
}

export default initMap
