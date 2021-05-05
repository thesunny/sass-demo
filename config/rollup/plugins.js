import commonjs from "@rollup/plugin-commonjs"
import filesize from "rollup-plugin-filesize"
import json from "@rollup/plugin-json"
import nodePolyfills from "rollup-plugin-node-polyfills"
import replace from "rollup-plugin-replace"
import resolve from "@rollup/plugin-node-resolve"
import sizes from "rollup-plugin-sizes"
import typescript from "rollup-plugin-typescript2"
import { string } from "rollup-plugin-string"
import path from "path"
import alias from "@rollup/plugin-alias"

export const plugins = [
  /**
   * React error process is not defined
   * <https://github.com/rollup/rollup/issues/487>
   */
  replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
  /**
   * The three arguments jsnext, preferBuiltins and browser are used to get
   * it to work with axios.
   *
   * <https://github.com/axios/axios/issues/1259>
   */
  resolve({ jsnext: true, preferBuiltins: true, browser: true }),
  /**
   * JSON processing
   */
  json(),
  /**
   * `commonjs` must come after `resolve`
   * <https://github.com/axios/axios/issues/1259>
   */
  commonjs(),
  /**
   * For some reason, somewhere in `~/lib/convert` something calls in `path`
   */
  nodePolyfills(),
  /**
   * Some libraries like `slate` use babel to transpile the results:
   *
   * <https://github.com/ianstormtaylor/slate/blob/main/config/rollup/rollup.config.js>
   *
   * We aren't at the moment but leaving this code in, in case I want to
   * consider using it for the future. The main question I wonder is why they
   * were using this in the first place as I somehow got it to work without
   * babel.
   */
  // babel(),
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        /**
         * Next.js likes the value `jsx: preserve`.
         *
         * For rollup only, we override this to be `jsx: react`
         *
         * <https://www.npmjs.com/package/rollup-plugin-typescript2>
         */
        jsx: "react",
        /**
         * We don't need declarations for Next.js but we want them for the
         * rollup.
         */
        declaration: true,
      },
    },
  }),
  /**
   * Resolve `~` to the root directory for `.css` files.
   *
   * We only do this for `.css` files because TypeScript files are handled
   * already in `tsconfig.json.` under the key `compilerOptions.paths`.
   *
   * Note: Order doesn't matter compared to the `string` plugin.
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
  // terser(),
  sizes(),
  filesize(),
]
