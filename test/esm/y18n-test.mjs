/* global describe, it */

import * as assert from 'assert'
import y18n, { Y18N } from '../../index.mjs'

describe('y18n', function () {
  it('__ smoke test', function () {
    const __ = y18n({
      locale: 'pirate',
      directory: './test/locales'
    }).__
    assert.strictEqual(
      __`Hi, ${'Ben'} ${'Coe'}!`,
      'Yarr! Shiver me timbers, why \'tis Ben Coe!'
    )
  })

  it('exposes an explicit construction', () => {
    const y18nOpts = {
      locale: 'pirate',
      directory: './test/locales'
    }
    const _y18n = new Y18N(y18nOpts)
    assert.strictEqual(
      _y18n.__`Hi, ${'Ben'} ${'Coe'}!`,
      'Yarr! Shiver me timbers, why \'tis Ben Coe!'
    )
  })
})
