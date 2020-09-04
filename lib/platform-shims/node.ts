import { readFileSync, statSync, writeFile } from 'fs'
import { format } from 'util'
import { resolve } from 'path'

export default {
  fs: {
    readFileSync,
    statSync,
    writeFile
  },
  format,
  resolve
}
