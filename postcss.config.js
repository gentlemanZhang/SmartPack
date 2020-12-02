const { platform } = require('./package.json')
const plugins = {
  autoprefixer: {},
  cssnano: {}
}

if (platform === 'wap') {
  plugins['postcss-px-to-viewport'] = {
    viewportWidth: 750,
    exclude: [
      /node_modules/
    ]
  }
}

module.exports = {
  plugins
}