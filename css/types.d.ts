/**
 * <https://github.com/webpack-contrib/raw-loader/issues/56#issuecomment-507057511>
 */

declare module "*.css" {
  const text: string
  export default text
}
