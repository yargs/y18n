import { y18n as _y18n } from './build/lib/index.js'
import type { Y18NOpts } from './build/lib/index.d.ts'
import shim from './lib/platform-shims/deno.ts'

const y18n = (opts: Y18NOpts) => {
  return _y18n(opts, shim)
}

export default y18n
