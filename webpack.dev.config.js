const path = require('path')

module.exports = {
  mode: 'development',
  entry: './js/src/index.js',
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js'),
    publicPath: 'js/'
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
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
}
