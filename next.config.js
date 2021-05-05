/**
 * <https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config>
 */

module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.css$/,
      loader: "raw-loader",
    })
    return config
  },
}
