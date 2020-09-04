import { y18n as _y18n, Y18NOpts } from './index.js'
import nodePlatformShim from './platform-shims/node.js'

const y18n = (opts: Y18NOpts) => {
  return _y18n(opts, nodePlatformShim)
}

export default y18n
