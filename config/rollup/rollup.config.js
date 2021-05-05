// import { onwarn } from "../onwarn"
import { plugins } from "./plugins"

export default {
  input: "component/index.tsx",
  output: [
    {
      file: ".build/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins,
  // onwarn,
  /**
   * Do not include `react` and `react-dom` in the deliverable.
   */
  external: ["react", "react-dom"],
}
