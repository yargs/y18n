/* global Deno */

import { posix } from 'https://deno.land/std/path/mod.ts'
import { sprintf } from 'https://deno.land/std/fmt/printf.ts'

export default {
  fs: {
    readFileSync: (path: string) => {
      try {
        return Deno.readTextFileSync(path)
      } catch (err) {
        // Fake the same error as Node.js, so that it does not bubble.
        err.code = 'ENOENT'
        throw err
      }
    },
    writeFile: Deno.writeFile
  },
  format: sprintf,
  resolve: (base: string, p1: string, p2: string) => {
    try {
      return posix.resolve(base, p1, p2)
    } catch (err) {
      // Most likely we simply don't have --allow-read set.
    }
  },
  exists: (file: string) => {
    try {
      return Deno.statSync(file).isFile
    } catch (err) {
      return false
    }
  }
}
