const pxToremOption = {
  rootValue: 100,
  unitPrecision: 5,
  propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'width', 'height'],
  selectorBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  exclude: /node_modules/i
}

module.exports = {
  plugins: [
    require('postcss-import'),
    require('precss'),
    require('postcss-advanced-variables'),
    require('autoprefixer'),
    require('postcss-pxtorem')(pxToremOption),
    require('cssnano')({
      zindex: false,
    }),
  ],
};