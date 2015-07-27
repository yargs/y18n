/* global describe, it, after, beforeEach */

var expect = require('chai').expect
var fs = require('fs')
var rimraf = require('rimraf')
var y18n = require('../')

require('chai').should()

describe('y18n', function () {
  describe('configure', function () {
    it('allows you to override the default y18n configuration', function () {
      var y = y18n({locale: 'fr'})
      y.locale.should.equal('fr')
    })
  })

  describe('_readLocaleFile', function () {
    it('throws a helpful error if language file has invalid syntax', function () {
      expect(function () {
        var __ = y18n({
          locale: 'bad-locale',
          directory: __dirname + '/locales'
        }).__

        __('Hello')
      }).to.throw(/syntax error/)
    })
  })

  describe('__', function () {
    it('uses replacements from the default locale if none is configured', function () {
      var __ = y18n({
        directory: __dirname + '/locales'
      }).__

      __('Hello').should.equal('Hello!')
    })

    it('uses replacements from the configured locale', function () {
      var __ = y18n({
        locale: 'pirate',
        directory: __dirname + '/locales'
      }).__

      __('Hello').should.equal('Avast ye mateys!')
    })

    it('expands arguments into %s placeholders', function () {
      var __ = y18n({
        directory: __dirname + '/locales'
      }).__

      __('Hello %s %s', 'Ben', 'Coe').should.equal('Hello Ben Coe')
    })

    describe('the first time observing a word', function () {
      beforeEach(function (done) {
        rimraf('./test/locales/fr.json', function () {
          return done()
        })
      })

      it('returns the word immediately', function () {
        var __ = y18n({
          locale: 'fr',
          directory: __dirname + '/locales'
        }).__

        __('banana').should.equal('banana')
      })

      it('writes new word to locale file if updateFiles is true', function (done) {
        var __ = y18n({
          locale: 'fr',
          directory: __dirname + '/locales'
        }).__

        __('banana', function (err) {
          var locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
          locale.banana.should.equal('banana')
          return done(err)
        })
      })

      it('handles enqueuing multiple writes at the same time', function (done) {
        var __ = y18n({
          locale: 'fr',
          directory: __dirname + '/locales'
        }).__

        __('apple')
        __('banana', function () {
          __('foo')
          __('bar', function (err) {
            var locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
            locale.apple.should.equal('apple')
            locale.banana.should.equal('banana')
            locale.foo.should.equal('foo')
            locale.bar.should.equal('bar')
            return done(err)
          })
        })
      })

      it('does not write the locale file if updateFiles is false', function (done) {
        var __ = y18n({
          locale: 'fr',
          updateFiles: false,
          directory: __dirname + '/locales'
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
      var __n = y18n({
        directory: __dirname + '/locales'
      }).__n

      __n('%s cat', '%s cats', 1).should.equal('1 cat')
    })

    it('uses the plural form if quantity is greater than 1', function () {
      var __n = y18n({
        directory: __dirname + '/locales'
      }).__n

      __n('%s cat', '%s cats', 2).should.equal('2 cats')
    })

    it('allows additional arguments to be printed', function () {
      var __n = y18n({
        directory: __dirname + '/locales'
      }).__n

      __n('%s %s cat', '%s %s cats', 2, 'black').should.equal('2 black cats')
    })

    it('allows an alternative locale to be set', function () {
      var __n = y18n({
        locale: 'pirate',
        directory: __dirname + '/locales'
      }).__n

      __n('%s cat', '%s cats', 1).should.equal('1 land catfish')
      __n('%s cat', '%s cats', 3).should.equal('3 land catfishes')
    })

    describe('the first time observing a pluralization', function () {
      beforeEach(function (done) {
        rimraf('./test/locales/fr.json', function () {
          return done()
        })
      })

      it('returns the pluralization immediately', function () {
        var __n = y18n({
          locale: 'fr',
          directory: __dirname + '/locales'
        }).__n

        __n('%s le cat', '%s le cats', 1).should.equal('1 le cat')
      })

      it('writes to the locale file if updateFiles is true', function (done) {
        var __n = y18n({
          locale: 'fr',
          directory: __dirname + '/locales'
        }).__n

        __n('%s apple %s', '%s apples %s', 2, 'dude', function (err) {
          var locale = JSON.parse(fs.readFileSync('./test/locales/fr.json', 'utf-8'))
          locale['%s apple %s'].one.should.equal('%s apple %s')
          locale['%s apple %s'].other.should.equal('%s apples %s')
          return done(err)
        })
      })

      it('does not write the locale file if updateFiles is false', function (done) {
        var __n = y18n({
          locale: 'fr',
          updateFiles: false,
          directory: __dirname + '/locales'
        }).__n

        __n('%s apple %s', '%s apples %s', 2, 'dude', function (err) {
          fs.existsSync('./test/locales/fr.json').should.equal(false)
          return done(err)
        })
      })
    })
  })

  after(function () {
    rimraf.sync('./test/locales/fr.json')
  })
})
