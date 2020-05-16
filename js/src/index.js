import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { ready } from './utils'
import { initTypography } from './typography'

import initJumpToNav from './components/jump-to-nav'
import initMap from './components/map'

ready(() => {
  initTypography()
  initJumpToNav()
  initMap()
})
