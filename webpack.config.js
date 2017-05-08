'use strict'

const LiveReloadPlugin = require('webpack-livereload-plugin')
    , devMode = require('.').isDevelopment
    , path = require('path')

/**
 * Fast source maps rebuild quickly during development, but only give a link
 * to the line where the error occurred. The stack trace will show the bundled
 * code, not the original code. Keep this on `false` for slower builds but
 * usable stack traces. Set to `true` if you want to speed up development.
 */

    , USE_FAST_SOURCE_MAPS = false

module.exports = {
  entry: './app/main.jsx',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  context: __dirname,
  devtool: devMode && USE_FAST_SOURCE_MAPS
    ? 'cheap-module-eval-source-map'
    : 'source-map',
  resolve: {
    alias: {
      'parchment': path.resolve(__dirname, 'node_modules/parchment/src/parchment.ts'),
      'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
    },
    extensions: ['.js', '.jsx', '.json', '*', 'ts', '.svg']
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
    }, {
      test: /\.ts$/,
      use: [{
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: false,
            target: 'es5',
            module: 'commonjs'
          },
          transpileOnly: true
        }
      }]
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }]
    }]
  },
  plugins: devMode
    ? [new LiveReloadPlugin({appendScriptTag: true})]
    : []
}



// //***QUILL WEBPACK */
// var path = require('path');

// module.exports = {
//   entry: "./app.js",
//   output: {
//     path: __dirname + "/dist",
//     filename: "bundle.js"
//   },
//   resolve: {
//     alias: {
//       'parchment': path.resolve(__dirname, 'node_modules/parchment/src/parchment.ts'),
//       'quill$': path.resolve(__dirname, 'node_modules/quill/quill.js'),
//     },
//     extensions: ['.js', '.ts', '.svg']
//   },
//   module: {
//     rules: [{
//       test: /\.js$/,
//       use: [{
//         loader: 'babel-loader',
//         options: {
//           presets: ['es2015']
//         }
//       }],
//     }, {
//       test: /\.ts$/,
//       use: [{
//         loader: 'ts-loader',
//         options: {
//           compilerOptions: {
//             declaration: false,
//             target: 'es5',
//             module: 'commonjs'
//           },
//           transpileOnly: true
//         }
//       }]
//     }, {
//       test: /\.svg$/,
//       use: [{
//         loader: 'html-loader',
//         options: {
//           minimize: true
//         }
//       }]
//     }]
//   }
// }
