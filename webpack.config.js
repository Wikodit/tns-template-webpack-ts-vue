const { resolve, join } = require("path");
const webpack = require('webpack');
const winston = require('winston-color');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');
const NativeScriptVueExternals = require('nativescript-vue-externals');
const NativeScriptVueTarget = require('nativescript-vue-target');

const pkg = require('./package.json')
const distPath = resolve(__dirname, 'dist')
const appPath = resolve(__dirname, 'src');
const appResourcesPath = resolve(__dirname, 'resources');

// Prepare NativeScript application from template (if necessary)
require('./prepare')();

// Generate platform-specific webpack configuration
const config = (platform, launchArgs, env) => {

  winston.info(`Bundling application for ${platform}...`);

  // CSS / SCSS style extraction loaders
  const cssLoader = ExtractTextPlugin.extract({
    use: [
      {
        loader: 'css-loader',
        options: {url: false},
      },
    ],
  });
  const scssLoader = ExtractTextPlugin.extract({
    use: [
      {
        loader: 'css-loader',
        options: {
          url: false,
          includePaths: [resolve(__dirname, 'node_modules')],
        },
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: [resolve(appPath, 'styles')]
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            resolve(appPath, 'styles/include.scss'),
            resolve(appPath, `styles/include.${platform}.scss`)
          ]
        },
      },
    ],
  });

  return {

    target: NativeScriptVueTarget,

    entry: resolve(__dirname, './src/main.ts'),

    output: {
      path: resolve(__dirname, resolve(distPath, 'app')),
      filename: `app.${platform}.js`,
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /((node_modules)|(fonts\/.*|\.font)\.(js|json))/,
          loader: 'babel-loader',
        },

        {
          test: /\.css$/,
          use: cssLoader,
        },
        {
          test: /\.scss$/,
          use: scssLoader,
        },
        {
          test: /\.pug$/,
          use: [
            'raw-loader',
            {
              loader: 'pug-html-loader',
              options: {
                data: { pkg, env: process.env, platform },
                export: false
              }
            }
          ],
        },

        {
          test: /\.ts$/,
          use: "awesome-typescript-loader",
          exclude: /(node_modules)/,
          include: [resolve('src')]
        },
        {
          test: /(fonts\/.*|\.font)\.(js|json)/,
          use: [
            'json-loader',
            'webfonts-loader',
          ]
        },
        {
          test: /\.vue$/,
          loader: 'ns-vue-loader',
          options: {
            loaders: {
              css: cssLoader,
              scss: scssLoader,
            },
          },
        },
      ],
    },

    resolve: {
      modules: [
        "src",
        'node_modules/tns-core-modules',
        'node_modules',
      ],
      alias: {
        'nativescript-angular/element-registry': '.',
        vue: 'nativescript-vue',
        '~': appPath
      },
      extensions: [
        `.${platform}.vue`,
        '.vue',
        `.${platform}.ts`,
        '.ts',
        `.${platform}.js`,
        '.js',
        `.${platform}.css`,
        '.css',
        `.${platform}.scss`,
        '.scss',
        `.${platform}.pug`,
        '.pug',
      ],
    },

    externals: NativeScriptVueExternals,

    plugins: [
      // Define useful constants like TNS_WEBPACK
      new webpack.DefinePlugin({
        "global.TNS_WEBPACK": "true",
        "global.TNS_RELEASE": `${!!env.release}`,
        "global.TNS_PRODUCTION": `${!!env.production}`,
        "global.TNS_VERBOSE": `${!!env.verbose}`,
      }),

      // Extract CSS to separate file
      new ExtractTextPlugin({filename: `app.${platform}.css`}),

      // Optimize CSS output
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          normalizeUrl: false
        },
        canPrint: false,
      }),

      // Minify JavaScript code
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {warnings: false},
      //   output: {comments: false},
      // }),

      // Copy src/assets/**/* to dist/
      new CopyWebpackPlugin([
        {from: 'assets', context: 'src'},
      ]),

      // Execute post-build scripts with specific arguments
      new WebpackSynchronizableShellPlugin({
        onBuildEnd: {
          scripts: [
            ... launchArgs ? [`node launch.js ${launchArgs}`] : [],
          ],
          blocking: false,
        },
      }),

    ],

    stats: 'errors-only',

    node: {
      'http': false,
      'timers': false,
      'setImmediate': false,
      'fs': 'empty',
    },

  };
};

// Determine platform(s) and action from webpack env arguments
module.exports = env => {
  const action = (!env || !env.tnsAction) ? 'build' : env.tnsAction;

  if (!env || (!env.android && !env.ios)) {
    return [config('android'), config('ios', action, env)];
  }

  return env.android && config('android', `${action} android`, env)
    || env.ios && config('ios', `${action} ios`, env)
    || {};
};
