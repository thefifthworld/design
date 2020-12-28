const path = require('path')

module.exports = {
  mode: 'production',
  entry: './js/src/index.js',
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'js'),
    publicPath: 'https://thefifthworld.s3.us-east-2.stackpathstorage.com/design/v/1/0/2/'
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
  }
}
