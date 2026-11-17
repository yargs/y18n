/* global describe, it */

const assert = require('assert');
const y18n = require('../../index.mjs');

describe('y18n', () => {
  it('__ smoke test', () => {
    const __ = y18n({
      locale: 'pirate',
      directory: './test/locales',
    }).__;

    assert.strictEqual(
      __`Hi, ${'Ben'} ${'Coe'}!`,
      "Yarr! Shiver me timbers, why 'tis Ben Coe!"
    );
  });
});
