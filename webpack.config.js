'use strict';

const LiveReloadPlugin = require('webpack-livereload-plugin')
    , BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    , webpack = require('webpack')
    , devMode = require('.').isDevelopment

/**
 * Fast source maps rebuild quickly during development, but only give a link
 * to the line where the error occurred. The stack trace will show the bundled
 * code, not the original code. Keep this on `false` for slower builds but
 * usable stack traces. Set to `true` if you want to speed up development.
 */

    , USE_FAST_SOURCE_MAPS = false;

module.exports = {
  entry: './app/main.jsx',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  externals: {
    'isomorphic-fetch': 'fetch'
  },
  context: __dirname,
  devtool: devMode && USE_FAST_SOURCE_MAPS
    ? 'cheap-module-eval-source-map'
    : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '*']
  },
  module: {
    rules: [{
      test: /jsx?$/,
      exclude: devMode ? /(node_modules|bower_components)/ : /(wikijs|mapbox-gl|material-auto-rotating-carousel)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-2', 'stage-0']
        }
      }]
    }]
  },
  plugins: devMode
    ? [new LiveReloadPlugin({appendScriptTag: true}),
    new BundleAnalyzerPlugin({openAnalyzer: false})]
    : [new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        test: /jsx?$/
      })],
};
