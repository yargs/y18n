/* global describe, it, after, beforeEach */

const expect = require('chai').expect
const fs = require('fs')
const rimraf = require('rimraf')
const y18n = require('../build/index.cjs')
const path = require('path')

require('chai').should()

describe('y18n', function () {
  describe('configure', function () {
    it('allows you to override the default y18n configuration', function () {
      const y = y18n({ locale: 'fr' })
      y.locale.should.equal('fr')
    })
  })

  describe('_readLocaleFile', function () {
    it('throws a helpful error if language file has invalid syntax', function () {
      expect(function () {
        const __ = y18n({
          locale: 'bad-locale',
          directory: path.join(__dirname, 'locales')
        }).__

        __('Hello')
      }).to.throw(/syntax error/)
    })
  })

  describe('__', function () {
    it('can be used as a tag for template literals', function () {
      const __ = y18n({
        locale: 'pirate',
        directory: path.join(__dirname, 'locales')
      }).__

      __`Hi, ${'Ben'} ${'Coe'}!`.should.equal('Yarr! Shiver me timbers, why \'tis Ben Coe!')
    })
    it('can be used as a tag for template literals with falsy arguments', function () {
      const __ = y18n({
        locale: 'pirate',
        directory: path.join(__dirname, 'locales')
      }).__
      __`Hi, ${'Ben'} ${''}!`.should.equal('Yarr! Shiver me timbers, why \'tis Ben !')
    })
    it('uses replacements from the default locale if none is configured', function () {
      const __ = y18n({
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello').should.equal('Hello!')
    })

    it('uses replacements from the configured locale', function () {
      const __ = y18n({
        locale: 'pirate',
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello').should.equal('Avast ye mateys!')
    })

    it('uses language file if language_territory file does not exist', function () {
      const __ = y18n({
        locale: 'pirate_JM',
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello').should.equal('Avast ye mateys!')
    })

    it('does not fallback to language file if fallbackToLanguage is false', function () {
      const __ = y18n({
        locale: 'pirate_JM',
        fallbackToLanguage: false,
        updateFiles: false,
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello').should.equal('Hello')
    })

    it('uses strings as given if no matching locale files found', function () {
      const __ = y18n({
        locale: 'zz_ZZ',
        updateFiles: false,
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello').should.equal('Hello')
    })

    it('expands arguments into %s placeholders', function () {
      const __ = y18n({
        directory: path.join(__dirname, 'locales')
      }).__

      __('Hello %s %s', 'Ben', 'Coe').should.equal('Hello Ben Coe')
    })

    describe('the first time observing a word', function () {
      beforeEach(function (done) {
        rimraf('./test/locales/fr*.json', function () {
          return done()
        })
      })

      it('returns the word immediately', function () {
        const __ = y18n({
          locale: 'fr',
          directory: path.join(__dirname, 'locales')
        }).__

        __('banana').should.equal('banana')
      })

      it('writes new word to locale file if updateFiles is true', function (done) {
        const __ = y18n({
          locale: 'fr_FR',
          directory: path.join(__dirname, 'locales')
        }).__

        __('banana', function (err) {
          const locale = JSON.parse(fs.readFileSync('./test/locales/fr_FR.json', 'utf-8'))
          locale.banana.should.equal('banana')
          return done(err)
        })
      })

      it('writes new word to language file if language_territory file does not exist', function (done) {
        fs.writeFileSync('./test/locales/fr.json', '{"meow": "le meow"}', 'utf-8')

        const __ = y18n({
          locale: 'fr_FR',
          directory: path.join(__dirname, 'locales')
        }).__

        __('meow').should.equal('le meow')
        __('banana', function (err) {
          const locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
          locale.banana.should.equal('banana')
          return done(err)
        })
      })

      it('writes word to missing locale file, if no fallback takes place', function (done) {
        fs.writeFileSync('./test/locales/fr.json', '{"meow": "le meow"}', 'utf-8')

        const __ = y18n({
          locale: 'fr_FR',
          fallbackToLanguage: false,
          directory: path.join(__dirname, 'locales')
        }).__

        __('banana', function (err) {
          // 'banana' should be written to fr_FR.json
          const locale = JSON.parse(fs.readFileSync('./test/locales/fr_FR.json', 'utf-8'))
          locale.should.deep.equal({
            banana: 'banana'
          })
          // fr.json should remain untouched
          const frJson = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
          frJson.should.deep.equal({
            meow: 'le meow'
          })
          return done(err)
        })
      })

      it('handles enqueuing multiple writes at the same time', function (done) {
        const __ = y18n({
          locale: 'fr',
          directory: path.join(__dirname, 'locales')
        }).__

        __('apple')
        __('banana', function () {
          __('foo')
          __('bar', function (err) {
            const locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
            locale.apple.should.equal('apple')
            locale.banana.should.equal('banana')
            locale.foo.should.equal('foo')
            locale.bar.should.equal('bar')
            return done(err)
          })
        })
      })

      it('does not write the locale file if updateFiles is false', function (done) {
        const __ = y18n({
          locale: 'fr',
          updateFiles: false,
          directory: path.join(__dirname, 'locales')
        }).__

        __('banana', function (err) {
          fs.existsSync('./test/locales/fr.json').should.equal(false)
          return done(err)
        })
      })
    })
  })

  describe('__n', function () {
    it('uses the singular form if quantity is 1', function () {
      const __n = y18n({
        directory: path.join(__dirname, 'locales')
      }).__n

      __n('%d cat', '%d cats', 1).should.equal('1 cat')
    })

    it('uses the plural form if quantity is greater than 1', function () {
      const __n = y18n({
        directory: path.join(__dirname, 'locales')
      }).__n

      __n('%d cat', '%d cats', 2).should.equal('2 cats')
    })

    it('allows additional arguments to be printed', function () {
      const __n = y18n({
        directory: path.join(__dirname, 'locales')
      }).__n

      __n('%d %s cat', '%d %s cats', 2, 'black').should.equal('2 black cats')
    })

    it('allows an alternative locale to be set', function () {
      const __n = y18n({
        locale: 'pirate',
        directory: path.join(__dirname, 'locales')
      }).__n

      __n('%d cat', '%d cats', 1).should.equal('1 land catfish')
      __n('%d cat', '%d cats', 3).should.equal('3 land catfishes')
    })

    // See: https://github.com/bcoe/yargs/pull/210
    it('allows a quantity placeholder to be provided in the plural but not singular form', function () {
      const __n = y18n({
        directory: path.join(__dirname, 'locales')
      }).__n

      const singular = __n('There is one monkey in the %s', 'There are %d monkeys in the %s', 1, 'tree')
      const plural = __n('There is one monkey in the %s', 'There are %d monkeys in the %s', 3, 'tree')

      singular.should.equal('There is one monkey in the tree')
      plural.should.equal('There are 3 monkeys in the tree')
    })

    describe('the first time observing a pluralization', function () {
      beforeEach(function (done) {
        rimraf('./test/locales/fr.json', function () {
          return done()
        })
      })

      it('returns the pluralization immediately', function () {
        const __n = y18n({
          locale: 'fr',
          directory: path.join(__dirname, 'locales')
        }).__n

        __n('%d le cat', '%d le cats', 1).should.equal('1 le cat')
      })

      it('writes to the locale file if updateFiles is true', function (done) {
        const __n = y18n({
          locale: 'fr',
          directory: path.join(__dirname, 'locales')
        }).__n

        __n('%d apple %s', '%d apples %s', 2, 'dude', function (err) {
          const locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
          locale['%d apple %s'].one.should.equal('%d apple %s')
          locale['%d apple %s'].other.should.equal('%d apples %s')
          return done(err)
        })
      })

      it('does not write the locale file if updateFiles is false', function (done) {
        const __n = y18n({
          locale: 'fr',
          updateFiles: false,
          directory: path.join(__dirname, 'locales')
        }).__n

        __n('%d apple %s', '%d apples %s', 2, 'dude', function (err) {
          fs.existsSync('./test/locales/fr.json').should.equal(false)
          return done(err)
        })
      })
    })
  })

  describe('setLocale', function () {
    it('switches the locale', function () {
      const i18n = y18n({
        directory: path.join(__dirname, 'locales')
      })

      i18n.__('Hello').should.equal('Hello!')
      i18n.setLocale('pirate')
      i18n.__('Hello').should.equal('Avast ye mateys!')
    })
  })

  describe('updateLocale', function () {
    beforeEach(function (done) {
      rimraf('./test/locales/fr.json', function () {
        return done()
      })
    })

    it('updates the locale with the new lookups provided', function () {
      const i18n = y18n({
        locale: 'fr',
        directory: path.join(__dirname, 'locales')
      })

      i18n.updateLocale({
        foo: 'le bar'
      })

      i18n.__('foo').should.equal('le bar')
    })

    it('loads the locale from disk prior to updating the map', function () {
      fs.writeFileSync('./test/locales/fr.json', '{"meow": "le meow"}', 'utf-8')

      const i18n = y18n({
        locale: 'fr',
        directory: path.join(__dirname, 'locales')
      })

      i18n.updateLocale({
        foo: 'le bar'
      })

      i18n.__('meow').should.equal('le meow')
    })
  })

  describe('getLocale', function () {
    it('returns the configured locale', function () {
      y18n().getLocale().should.equal('en')
    })
  })

  // See: https://github.com/yargs/y18n/issues/96,
  // https://github.com/yargs/y18n/pull/107
  describe('prototype pollution', () => {
    it('does not pollute prototype, with __proto__ locale', () => {
      const y = y18n()
      y.setLocale('__proto__')
      y.updateLocale({ polluted: '👽' })
      y.__('polluted').should.equal('👽')
      ;(typeof polluted).should.equal('undefined')
    })

    it('does not pollute prototype, when __ is used with __proto__ locale', () => {
      const __ = y18n({ locale: '__proto__' }).__
      __('hello')
      ;(typeof {}.hello).should.equal('undefined')
    })
  })

  after(function () {
    rimraf.sync('./test/locales/fr.json')
  })
})
