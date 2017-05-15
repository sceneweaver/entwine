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
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015', 'stage-2']
        }
      }]
    }]
  },
  plugins: devMode
    ? [new LiveReloadPlugin({appendScriptTag: true, openAnalyzer: false}),
    new BundleAnalyzerPlugin(),
    new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		})
    ]
    : [new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
			},
			output: {
				comments: false,
			},
		})],
};
