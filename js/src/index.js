import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { ready } from './utils'
import { initTypography } from './typography'

import initCollapsibles from './components/collapsible'
import initFigures from './components/figure'
import initFileUploads from './components/file-upload'
import initJumpToNav from './components/jump-to-nav'
import initLikes from './components/like-unlike'
import initMap from './components/map'
import initTitlePathParent from './components/title-path-parent'

ready(() => {
  initTypography()
  initCollapsibles()
  initFileUploads()
  initFigures()
  initJumpToNav()
  initLikes()
  initMap()
  initTitlePathParent()
})
