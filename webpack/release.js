
var path = require('path')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var gen = require('./packinfogen')

gen(false)

var config = {
  entry: path.resolve(__dirname, '../index.js'),
  output: {
    library: 'Chivy',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../.package'),
    filename: 'chivy.min.js',
    umdNamedDefine: true
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },

  plugins: [
    new UglifyJSPlugin({
      mangle: {
        // Skip mangling these
        except: ['$super', '$', 'exports', 'require']
      },
      sourceMap: true
    })
  ]
}

module.exports = config
