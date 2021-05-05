# SCSS Demo

This project demonstrates how to add SCSS to a React project in such a way that it can be compiled into a single file using `rollup`.

It does this by:

- Watching the `scss` file and compiling it to a `css.text` file
- Importing the `css.text` file into a module
- Adding the `css.text` file into a React `<style>` element

In order for this to work, we have to:

- Add and configure `raw-loader` for WebPack in `next.config.js`
- Add and configure `rollup-plugin-string` for `rollup` (TODO)

## Create `styles.scss` file

Create a `styles.scss` file at `scss/styles.scss` that you want to import.

This is the `.scss` file we will use to generate the `.css` file that we will inject directly into a `<style>` tag on our web page.

## Compiling `.scss` to `.css.text`

We use the `sass` package to watch the `.scss` file and convert it into `.css` file whenever there are changes. We create a script in `package.json` to do this.

Add `sass` package

```sh
yarn add --dev sass
```

```json
{
  "scripts": {
    "watch:sass": "sass --watch scss/styles.scss:css/styles.css"
  }
}
```

This script watches and converts `scss/styles.scss` to `css/styles.css`

## Enable import of `.css` files in webpack for NextJS

By default, we can't import a `.css` file and have it returned as a string. We need to add the `raw-loader` for webpack to do this.

Add `raw-loader` package

```sh
yarn add --dev raw-loader
```

```js
// next.config.js
module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.css$/,
      loader: "raw-loader",
    })
    return config
  },
}
```

## Add types for the `.css` file

By default, TypeScript does not know how to handle a `.css` import

In the `css` directory, add a `types.d.ts` file.

```ts
declare module "*.css" {
  const text: string
  export default text
}
```

## Enable import of `.css` files in rollup

To import `.ccs` file in rollup, we need to add the `rollup-plugin-string` plugin to import `.css` files as `string` and the `@rollup/plugin-alias` plugin to map `~` to the root directory.

```sh
yarn add --dev @rollup/plugin-alias rollup-plugin-string
```

In addition to the plugins that you normally would already see to resolve, we add the two plugins:

```js
import { string } from "rollup-plugin-string"
import alias from "@rollup/plugin-alias"

const plugins = [
  /**
   * ...other plugins
   */

  /**
   * Resolve `~` to the root directory for `.css` files.
   *
   * We only do this for `.css` files because TypeScript files are handled
   * already in `tsconfig.json.` under the key `compilerOptions.paths`.
   *
   * Note: Order doesn't matter relative to the `string` plugin.
   */
  alias({
    entries: [
      {
        find: /^\~(.*)[.]css$/,
        replacement: path.resolve(__dirname, "../..", "$1.css"),
        customResolver: resolve({ extensions: [".css"] }),
      },
    ],
  }),
  /**
   * Import `.css` files as raw strings
   */
  string({ include: /\.css$/ }),
]
```
