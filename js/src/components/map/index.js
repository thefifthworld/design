import leaflet from 'leaflet'
import { select, removeSelector, addClass, hasClass, requestLocation } from '../../utils'

/**
 * Initialize maps.
 * @param wrappers {Element[]} - An array of the map wrappers that should be
 *   populated.
 * @returns {Promise<void>} - A Promise that resolves when the map wrappers
 *   have been populated.
 */

const initMap = async wrappers => {
  removeSelector('.leaflet-wrapper .no-js')
  const worldWrappers = select('.leaflet-wrapper.world')
  const promptLocation = worldWrappers.length === 1

  let center = [0, 0]
  if (promptLocation) {
    try {
      const pos = await requestLocation()
      center = [pos.coords.latitude, pos.coords.longitude]
    } catch {
      center = [0, 0]
    }
  }

  if (wrappers) {
    wrappers.forEach((wrapper, index) => {
      const id = `leaflet-wrapper-${index}`
      wrapper.setAttribute('id', id)
      addClass(wrapper, 'initialized')

      const isPlace = hasClass(wrapper, 'place')
      if (isPlace) {
        const attr = wrapper.dataset.coords ? wrapper.dataset.coords.split(',') : null
        if (attr && Array.isArray(attr) && attr.length > 1) {
          const nums = attr.map(c => parseFloat(c)).filter(c => !isNaN(c))
          if (nums.length > 1) center = [nums[0], nums[1]]
        }
      }

      const map = leaflet.map(id)
      const zoom = center.toString() === '0,0' ? 3 : 14
      const attribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      const maxZoom = 18
      map.setView(center, zoom)
      leaflet.tileLayer('http://b.tile.stamen.com/terrain-background/{z}/{x}/{y}.png', { attribution, maxZoom }).addTo(map)

      if (isPlace) {
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.scrollWheelZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()
        if (map.tap) map.tap.disable()
        leaflet.marker(center).addTo(map)
      }
    })
  }
}

export default initMap
