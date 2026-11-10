# y18n

[![NPM version][npm-image]][npm-url]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

The bare-bones internationalization library used by yargs.

Inspired by [i18n](https://www.npmjs.com/package/i18n).

## Examples

_simple string translation:_

```mjs
import y18n from 'y18n';
const __ = y18n().__;

console.log(__('my awesome string %s', 'foo'));
```

output:

`my awesome string foo`

_using tagged template literals_

```js
import y18n from 'y18n';
const __ = y18n().__;

const str = 'foo';

console.log(__`my awesome string ${str}`);
```

output:

`my awesome string foo`

_pluralization support:_

```js
import y18n from 'y18n';
const __n = y18n().__n;

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

## Factory Function

The default export from y18n is a factory function. Use the function to create an instance of y18n. You may optionally supply configure options:

- `directory`: the locale directory, default `./locales`.
- `updateFiles`: should newly observed strings be updated in file, default `true`.
- `locale`: what locale should be used.
- `fallbackToLanguage`: should fallback to a language-only file (e.g. `en.json`)
  be allowed if a file matching the locale does not exist (e.g. `en_US.json`),
  default `true`.

## Methods

A y18n instance has the following methods.

### \_\_(str, arg, arg, arg)

Print a localized string, `%s` will be replaced with `arg`s.

This function can also be used as a tag for a template literal. You can use it
like this: <code>**&#96;hello ${'world'}&#96;</code>. This will be equivalent to
`**('hello %s', 'world')`.

### \_\_n(singularString, pluralString, count, arg, arg, arg)

Print a localized string with appropriate pluralization. If `%d` is provided
in the string, the `count` will replace this placeholder.

### setLocale(str)

Set the current locale being used.

### getLocale()

What locale is currently being used?

### updateLocale(obj)

Update the current locale with the key value pairs in `obj`.

## Support

Libraries in this ecosystem make a best effort to track
[Node.js' release schedule](https://nodejs.org/en/about/releases/). Here's [a
post on why we think this is important](https://medium.com/the-node-js-collection/maintainers-should-consider-following-node-js-release-schedule-ab08ed4de71a).

The current version of `y18n` is fully supported on Long Term Support versions of Node.js, and requires at least v10.

Older major versions of `y18n` receive security updates for 12 months. For more see: [Release Policy](./docs/release-policy.md).

The main forum for free and community support is the project [Issues](https://github.com/yargs/y18n/issues) on GitHub.

## Special Thanks

[HeroDevs](https://www.herodevs.com) sponsored the yargs projects with a donation from
its Open Source Sustainability Fund in 2026.

## License

ISC

[npm-url]: https://npmjs.org/package/y18n
[npm-image]: https://img.shields.io/npm/v/y18n.svg
