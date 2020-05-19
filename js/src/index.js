import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { ready } from './utils'
import { initTypography } from './typography'

import initCollapsibles from './components/collapsible'
import initJumpToNav from './components/jump-to-nav'
import initMap from './components/map'

ready(() => {
  initTypography()
  initCollapsibles()
  initJumpToNav()
  initMap()
})
