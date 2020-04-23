import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { ready } from './utils'
import { initTypography } from './typography'

ready(() => {
  initTypography()
})
