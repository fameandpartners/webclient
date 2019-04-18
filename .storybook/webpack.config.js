const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function srcPath(subdir) {
    return path.join(__dirname, "../src", subdir);
}

function rootPath(subdir) {
  return path.join(__dirname, "../", subdir);
}

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@containers': srcPath('common/containers'),
      '@common': srcPath('common'),
      '@components': srcPath('common/components'),
      '@constants': srcPath('common/constants'),
      '@services': srcPath('common/services'),
      '@svg': srcPath('common/assets/svg'),
      '@scss': srcPath('common/assets/scss'),
      '@transforms': srcPath('common/transforms'),
      '@translations': srcPath('common/translations'),
      '@typings': srcPath('typings'),
      '@utils': srcPath('utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.tsx?$/,
        loaders: [
          "babel-loader", 
          {
            loader: "ts-loader", 
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            },
            {
                loader: 'svg-sprite-loader',
                options: { 
                    runtimeGenerator: require.resolve('./svg-to-icon-component-runtime-generator')
                }
            },
            {
              loader: 'svgo-loader'
            }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: [
          /\.svg$/,
          /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/
        ], 
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      },
      {
        test: [/\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/],
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: 'static/fonts/[name].[hash:8].[ext]',
            emitFile: true,
        },
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tsconfig: rootPath('tsconfig.json').toString(),
      tslint: rootPath('tslint.json').toString(),
      watch: [path.resolve(__dirname, '../')],
      typeCheck: true,
      workers: 2,
    })
  ]
}
