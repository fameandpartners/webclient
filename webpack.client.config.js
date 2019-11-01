const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { getClientEnvironment, stringified, paths } = require('./scripts/utils/paths');
const alias = require('./scripts/utils/alias');

const IS_DEV = process.env.NODE_ENV === 'development';

const devServerHost = process.env.HOST || 'localhost';
console.log("ttttttttttttttttttttttttttttttttttttttt");
console.log(process.env.HOST);
const devServerPort = parseInt(process.env.PORT, 10) + 1 || 3003;

const dotenv = getClientEnvironment('web');

module.exports = {
  mode: IS_DEV ? 'development' : 'production',
  context: process.cwd(),
  target: 'web',
  devtool: IS_DEV ? 'eval-source-map' : 'none',
  resolve: {
    extensions: ['.ts', '.tsx', '.json', '.js', '.jsx', '.mjs'],
    alias: alias,
    modules: ['node_modules', paths.nodeModules, paths.src]
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: false,
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [autoprefixer()]
            }
          },
          require.resolve('sass-loader')
        ]
      },
      // Avoid "require is not defined" errors
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      // Transform ES6 with Babel
      {
        test: /\.(js|jsx|mjs)$/,
        include: [paths.src],
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true,
              cacheDirectory: true,
              presets: []
            }
          }
        ]
      },
      {
        test: /\.ts(x?)$/,
        include: [paths.src],
        loaders: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true,
              cacheDirectory: true,
              presets: []
            }
          },
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: true
            }
          },
          {
            loader: require.resolve('svg-sprite-loader'),
            options: {
              runtimeGenerator: require.resolve('./.storybook/svg-to-icon-component-runtime-generator')
            }
          },
          {
            loader: require.resolve('svgo-loader')
          }
        ]
      },
      {
        // test: /\.(png|jpg|gif)$/,
        exclude: [/\.html$/, /\.(js|jsx|mjs)$/, /\.(ts|tsx)$/, /\.(vue)$/, /\.(less)$/, /\.(re)$/, /\.(s?css|sass)$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/, /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/],
        use: [
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
              emitFile: true
            }
          }
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
          emitFile: true
        }
      },
      {
        test: [/\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:8].[ext]',
          emitFile: true
        }
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
      path: paths.build,
      filename: 'assets.json'
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html|\.svg|\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      threshold: 10240,
      minRatio: 0.8,
      quality: IS_DEV ? 0 : 9
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.js$|\.css$|\.html|\.svg|\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      threshold: 10240,
      minRatio: 0.8,
      quality: IS_DEV ? 0 : 11
    }),
    // new MiniCssExtractPlugin(),
    IS_DEV ? new webpack.HotModuleReplacementPlugin({ multiStep: true }) : undefined,
    IS_DEV ? new webpack.DefinePlugin(stringified(dotenv.raw)) : undefined,
    new WebpackBar({
      color: '#f56be2',
      name: 'client'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: './tsconfig.json',
      tslint: './tslint.json',
      watch: [paths.src],
      typeCheck: true,
      workers: 2
    })
  ].filter(Boolean),
  entry: {
    // We still use razzle-dev-utils forked version of the client because it provides us with the port bindings for this client/server architecture influenced by razzle
    client: [IS_DEV ? require.resolve('razzle-dev-utils/webpackHotDevClient') : '', './src/client/index.tsx'].filter(Boolean),
    widgetGlobalElements: ['./src/widget/GlobalElements.tsx']
  },
  output: IS_DEV
    ? {
        path: paths.buildPublic,
        publicPath: `http://${devServerHost}:${devServerPort}/`,
        pathinfo: false,
        libraryTarget: 'var',
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/')
      }
    : {
        path: paths.buildPublic,
        publicPath: dotenv.raw.PUBLIC_PATH || '/',
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        libraryTarget: 'var'
      },
  devServer: IS_DEV
    ? {
        disableHostCheck: true,
        clientLogLevel: 'none',
        // Enable gzip compression of generated files.
        compress: true,
        // watchContentBase: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        historyApiFallback: {
          // Paths with dots should still use the history fallback.
          // See https://github.com/facebookincubator/create-react-app/issues/387.
          disableDotRule: true
        },
        host: devServerHost,
        hot: true,
        noInfo: true,
        overlay: false,
        port: devServerPort,
        quiet: true,
        // By default files from `contentBase` will not trigger a page reload.
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
          ignored: /node_modules|scripts/
        },
        before(app) {
          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware());
        }
      }
    : undefined,
  optimization: {
    minimize: !IS_DEV,
    minimizer: !IS_DEV
      ? [
          new UglifyJsPlugin({
            uglifyOptions: {
              parse: {
                // we want uglify-js to parse ecma 8 code. However, we don't want it
                // to apply any minfication steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false
              },
              mangle: {
                safari10: true
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true
              }
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            // @todo add flag for sourcemaps
            sourceMap: true
          })
        ]
      : [],
    runtimeChunk: false,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: IS_DEV
      ? false
      : {
          // Chunk splitting optimiztion
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              enforce: true,
              chunks: 'all'
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          },
          // Switch off name generation, otherwise files would be invalidated
          // when more chunks with the same vendors are added
          name: false
        }
  }
};
