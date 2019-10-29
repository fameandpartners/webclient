const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const { getClientEnvironment, stringified, paths, srcPath } = require('./scripts/utils/paths');
const alias = require('./scripts/utils/alias');

const IS_DEV = process.env.NODE_ENV === 'development';

const devServerHost = process.env.HOST || '192.168.1.40';
const devServerPort = parseInt(process.env.PORT, 10) + 1 || 3003;

const dotenv = getClientEnvironment('node');

module.exports = {
    mode: IS_DEV ? 'development' : 'production',
    context: process.cwd(),
    target: 'node',
    devtool: IS_DEV ? 'eval-source-map' : 'none',
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js', '.jsx', '.mjs'],
        alias: alias,
        modules: ['node_modules', paths.nodeModules]
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /.scss$/,
                loaders: [require.resolve('css-loader'), require.resolve('sass-loader')]
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
                exclude: [
                    /\.html$/,
                    /\.(js|jsx|mjs)$/,
                    /\.(ts|tsx)$/,
                    /\.(vue)$/,
                    /\.(less)$/,
                    /\.(re)$/,
                    /\.(s?css|sass)$/,
                    /\.json$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                    /\.svg$/,
                    /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/
                ],
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
    node: {
        __console: false,
        __dirname: false,
        __filename: false
    },
    externals: [
        nodeExternals({
            whitelist: [
                IS_DEV ? 'webpack/hot/poll?300' : null,
                /\.(eot|woff|woff2|ttf|otf)$/,
                /\.(svg|png|jpg|jpeg|gif|ico)$/,
                /\.(mp4|mp3|ogg|swf|webp)$/,
                /\.(css|scss|sass|sss|less)$/,
                /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/
            ].filter(x => x)
        })
    ],
    output: {
        path: paths.build,
        publicPath: IS_DEV ? `http://${devServerHost}:${devServerPort}/` : '/',
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    plugins: [
        new webpack.DefinePlugin(stringified(dotenv.raw)),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        IS_DEV ? new webpack.HotModuleReplacementPlugin() : undefined,
        IS_DEV
            ? new StartServerPlugin({
                  name: 'server.js',
                  nodeArgs: ['-r', 'source-map-support/register', process.env.INSPECT_BRK && process.env.INSPECT_BRK, process.env.INSPECT && process.env.INSPECT].filter(Boolean)
              })
            : undefined,
        IS_DEV ? new webpack.WatchIgnorePlugin([paths.buildManifest]) : undefined
    ].filter(Boolean),
    entry: [IS_DEV ? 'webpack/hot/poll?300' : '', './src/index.ts'].filter(Boolean),
    watch: IS_DEV
};
