/* global Deno */

import {
  assertEquals
} from 'https://deno.land/std/testing/asserts.ts'
import y18n from '../../deno.ts'

// Parser:
Deno.test('smoke test', () => {
  const __ = y18n({
    locale: 'pirate',
    directory: './test/locales'
  }).__

  assertEquals(
    __`Hi, ${'Ben'} ${'Coe'}!`,
    'Yarr! Shiver me timbers, why \'tis Ben Coe!'
  )
})
