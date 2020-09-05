/* global describe, it */

import * as assert from 'assert'
import y18n from '../../index.mjs'

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
})
