# y18n

The bare-bones internationalization library used by yargs.

Inspired by [i18n](https://www.npmjs.com/package/i18n).

## Examples

_simple string translation:_

```js
var __ = require('y18n').__

console.log(__('my awesome string %s', 'foo'))
```

output:

`my awesome string foo`

_pluralization support:_

```js
var __n = require('y18n').__n

console.log(__('one fish', 'two fishes %s', 2, 'foo'))
```

output:

`two fishes foo`

## JSON Language Files

The JSON language files should be stored in a `./locales` folder,
file names correspond to locales, e.g., `en.json`, `pirate.json`.

When strings are observed for the first time, they will be
added to the JSON file corresponding to the default locale.

## Methods

### require('y18n')(config)

Create an instance of y18n with the config provided, options include:

* `directory`: the locale directory, default `./locales`.
* `updateFiles`: should newly observed strings be updated in file, default `true`.
* `locale`: what locale should be used.

### y18n.\_\_(str, arg, arg, arg)

Print a localized string, `%s` will be replaced with `arg`s.

### y18n.\_\_n(singularString, pluarlString, count, arg, arg, arg)

Print a localized string with appropriate pluralization.

### y18n.setLocale(str)

Set the current locale being used.

### y18n.getLocale()

What locale is currently being used?

### y18n.setLocale(locale, obj)

Override `locale` with the string lookups provided in `obj`.

## License

ISC
