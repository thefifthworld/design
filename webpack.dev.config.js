const path = require('path')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  mode: 'development',
  entry: './js/src/index.js',
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js/lib'),
    publicPath: '/js/lib/'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ]
          }
        }
      }
    ]
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
}
