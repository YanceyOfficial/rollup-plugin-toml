[npm]: https://img.shields.io/npm/v/@yancey-inc/rollup-plugin-toml
[npm-url]: https://www.npmjs.com/package/@yancey-inc/rollup-plugin-toml
[size]: https://packagephobia.now.sh/badge?p=@yancey-inc/rollup-plugin-toml
[size-url]: https://packagephobia.now.sh/result?p=@yancey-inc/rollup-plugin-toml

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

# @yancey-inc/rollup-plugin-toml

🍣 A Rollup plugin which Converts TOML files to ES6 modules.

## Requirements

This plugin requires an [LTS](https://github.com/nodejs/Release) Node version (v8.0.0+) and Rollup v1.20.0+.

## Install

Using npm:

```console
npm install @yancey-inc/rollup-plugin-toml --save-dev
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import toml from '@yancey-inc/rollup-plugin-toml'

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [toml()],
}
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `exclude`

Type: `FilterPattern`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.

### `include`

Type: `FilterPattern`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted.

## Meta

[CONTRIBUTING](/.github/CONTRIBUTING.md)

[LICENSE (MIT)](/LICENSE)
