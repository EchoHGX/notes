const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('../config')
const HappyPack = require('happypack');
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils')

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    main: './src/index.js'
  },
  output: {
    path: config.build.assetRoot,
    // publicPath: '/',
    publicPath: utils.isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  // 配置别名
  resolve: {
    alias: {
      '@': resolve('src'),
      '~': resolve('src/assets')
    },
    // false可以不带扩展
    enforceExtension: false,
    // 自动解析确定的扩展
    extensions: ['.js', '.vue', '.json']
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'responsive-loader',
              limit: 4096,
              quality: 50,
              name: '[name].[hash:8].[ext]',
              outputPath: 'img'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ],
        use: 'happypack/loader?id=js'
        // exclude: /node_modules/,
        // use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // ...(isProduction 
    //     ? [
    //         new MiniCssExtractPlugin({
    //           filename: 'css/[name].[contentHash:8].css'
    //         })
    //       ] 
    //     : []),
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: ['babel-loader?cacheDirectory']
    }),
    
  ]
}