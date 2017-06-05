const path = require('path');
const webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  context: __dirname,
  entry: [
    './app',
  ],
  output: {
    path: './build',
    filename: 'bundle.js',
    publicPath: '/',
  },
  node: {
    fs: 'empty',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.scss$/, loader: 'style!css!sass' },
      {
        test: /\.(?:png|jpg|svg)$/,
        loader: 'url-loader?name=/images/[name].[ext]',
        query: {
          limit: 10000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css'],
  },
};
