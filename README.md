# y18n

[![NPM version][npm-image]][npm-url]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

The bare-bones internationalization library used by yargs.

Inspired by [i18n](https://www.npmjs.com/package/i18n).

## Examples

_simple string translation:_

```mjs
import y18 from 'y18n';
const __ = y18().__;

console.log(__('my awesome string %s', 'foo'));
```

output:

`my awesome string foo`

_using tagged template literals_

```js
import y18 from 'y18n';
const __ = y18().__;

const str = 'foo';

console.log(__`my awesome string ${str}`);
```

output:

`my awesome string foo`

_pluralization support:_

```js
import y18 from 'y18n';
const __n = y18().__n;

console.log(__n('one fish %s', '%d fishes %s', 2, 'foo'));
```

output:

`2 fishes foo`

## Deno Example

As of `v5` `y18n` supports [Deno](https://github.com/denoland/deno):

```typescript
import y18n from 'https://deno.land/x/y18n/deno.ts';

const __ = y18n({
  locale: 'pirate',
  directory: './test/locales',
}).__;

console.info(__`Hi, ${'Ben'} ${'Coe'}!`);
```

You will need to run with `--allow-read` to load alternative locales.

## JSON Language Files

The JSON language files should be stored in a `./locales` folder.
File names correspond to locales, e.g., `en.json`, `pirate.json`.

When strings are observed for the first time they will be
added to the JSON file corresponding to the current locale.

## Methods

### y18(config)

Create an instance of y18n with the config provided, options include:

- `directory`: the locale directory, default `./locales`.
- `updateFiles`: should newly observed strings be updated in file, default `true`.
- `locale`: what locale should be used.
- `fallbackToLanguage`: should fallback to a language-only file (e.g. `en.json`)
  be allowed if a file matching the locale does not exist (e.g. `en_US.json`),
  default `true`.

### y18n.\_\_(str, arg, arg, arg)

Print a localized string, `%s` will be replaced with `arg`s.

This function can also be used as a tag for a template literal. You can use it
like this: <code>**&#96;hello ${'world'}&#96;</code>. This will be equivalent to
`**('hello %s', 'world')`.

### y18n.\_\_n(singularString, pluralString, count, arg, arg, arg)

Print a localized string with appropriate pluralization. If `%d` is provided
in the string, the `count` will replace this placeholder.

### y18n.setLocale(str)

Set the current locale being used.

### y18n.getLocale()

What locale is currently being used?

### y18n.updateLocale(obj)

Update the current locale with the key value pairs in `obj`.

## Supported Node.js Versions

Libraries in this ecosystem make a best effort to track
[Node.js' release schedule](https://nodejs.org/en/about/releases/). Here's [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

## License

ISC

[npm-url]: https://npmjs.org/package/y18n
[npm-image]: https://img.shields.io/npm/v/y18n.svg
