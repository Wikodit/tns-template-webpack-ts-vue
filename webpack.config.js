const Module = require('module')
const originalRequire = Module.prototype.require
Module.prototype.require = function (name) {
  if (name === './JsonpMainTemplate.runtime.js') {
    return originalRequire.apply(this, [ resolve('./config/JsonpMainTemplate.runtime.js') ])
  }
  return originalRequire.apply(this, arguments)
}


const { resolve, join } = require('path')

const pkg = require('./package.json')

const webpack = require('webpack')
const nsWebpack = require('nativescript-dev-webpack')
const nativescriptTarget = require('nativescript-dev-webpack/nativescript-target')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
var MergeFilesPlugin = require('merge-files-webpack-plugin')

const extractMainSheet = new ExtractTextPlugin('app-0.css')
const extractCSS = new ExtractTextPlugin('app-1.css')

const sassResourcesLoader = {
  loader: 'sass-resources-loader',
  options: {
    resources: [
      resolve('app/styles/include.scss')
    ]
  },
}

module.exports = (env) => {
  const platform = getPlatform(env)

  // tns/app -or- default destination inside platforms/<platform>/...
  const path = env.tns ? resolve('platforms/tns/app') : resolve(nsWebpack.getAppPath(platform))

  const entry = {
    // Discover entry module from package.json
    bundle: `./${nsWebpack.getEntryModule()}`,

    // Vendor entry with third-party libraries
    vendor: `./vendor.ts`,

    // Entry for stylesheet with global application styles
    'app.css': `./styles/main.scss`,
  }

  const rules = getRules()
  const plugins = getPlugins(platform, env)
  const extensions = getExtensions(platform)

  return {
    context: resolve('./app'),
    target: nativescriptTarget,
    entry,
    devtool: 'inline-source-map',
    output: {
      pathinfo: true,
      path,
      libraryTarget: 'commonjs2',
      filename: '[name].js',
    },
    resolve: {
      alias: {
        vue: 'nativescript-vue'
      },
      extensions,

      // Resolve {N} system modules from tns-core-modules
      modules: [
        'app',
        'node_modules/tns-core-modules',
        'node_modules',
      ]
    },
    node: {
      // Disable node shims that conflict with NativeScript
      'http': false,
      'timers': false,
      'setImmediate': false,
      'fs': 'empty',
    },
    module: { rules },
    plugins,
  }
}

function getPlatform(env) {
  return env.android ? 'android' :
    env.ios ? 'ios' :
      () => { throw new Error('You need to provide a target platform!') }
}

function getRules() {
  return [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('app')]
    },
    { test: /\.ts$/, exclude: /node_modules/, enforce: 'pre', loader: 'tslint-loader' },
    {
      test: /\.ts$/,
      use: 'awesome-typescript-loader',
      include: [resolve('app')],
    },
    {
      test: /\.html$|\.xml$/,
      use: [
        'raw-loader',
      ]
    },
    {
      test: /\.pug$/,
      use: [
        'vue-template-es2015-loader',
        {
          loader: 'pug-html-loader',
          options: {
            data: { pkg, env: process.env },
            export: false
          }
        }
      ],
    },
    // Root stylesheet gets extracted with bundled dependencies
    {
      test: /styles\/main\.s[c|a]ss$/,
      include: [resolve('app/styles')],
      use: extractMainSheet.extract([
        'raw-loader',
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [resolve('app/styles')]
          }
        },
        sassResourcesLoader
      ]),
    },
    // Other CSS files get bundled using the raw loader
    {
      test: /\.css$/,
      loader: extractCSS.extract({
        fallback: 'style-loader',
        use: {
          loader: 'css-loader',
          options: { url: false }
        }
      })

    },
    // SASS support
    {
      test: /\.s[a|c]ss$/,
      exclude: [/styles\/main\.s[c|a]ss$/],
      use: [
        'raw-loader',
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [resolve('app/styles')]
          }
        },
        sassResourcesLoader
      ]
    },
  ]
}

function getPlugins(platform, env) {
  let plugins = [
    extractMainSheet,
    extractCSS,

    new MergeFilesPlugin({
      filename: 'app.css',
      test: /app-[0-1]\.css/,
      deleteSourceFiles: true
    }),

    // Vendor libs go to the vendor.js chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
    }),

    // Define useful constants like TNS_WEBPACK
    new webpack.DefinePlugin({
      'global.TNS_WEBPACK': 'true',
    }),

    // Copy assets to out dir. Add your own globs as needed.
    new CopyWebpackPlugin([
      { from: 'assets/fonts/**' },
      { from: 'assets/images/**.jpg' },
      { from: 'assets/images/**.png' }
    ]),
  ]

  plugins.push(
    // Generate a bundle starter script and activate it in package.json
    new nsWebpack.GenerateBundleStarterPlugin([
      './vendor',
      './bundle',
    ])
  )

  if (env.uglify) {
    plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }))

    // Work around an Android issue by setting compress = false
    const compress = platform !== 'android'
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      mangle: { except: nsWebpack.uglifyMangleExcludes },
      compress,
    }))
  }

  return plugins
}

// Resolve platform-specific modules like module.android.js
function getExtensions(platform) {
  return Object.freeze([
    `.${platform}.ts`,
    '.ts',
    `.${platform}.js`,
    '.js',
    `.${platform}.json`,
    '.json',
    `.${platform}.css`,
    '.css',
    `.${platform}.scss`,
    '.scss',
    `.${platform}.vue`,
    '.vue',
    `.${platform}.pug`,
    '.pug',
  ])
}
