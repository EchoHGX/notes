const webpack = require('webpack')
const merge = require('webpack-merge')
const BaseConfig = require('./webpack.base.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const OptimizationCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(BaseConfig, {
  mode: 'production',
  optimization: {
    // 对代码进行代码分割，生成公共包
    splitChunks: {
      chunks: 'all',
      minSize: 0, // 生产块的最小大小
      maxSize: 0,
      name: true,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        terserOptions: {
          cache: true,
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      }),
      new OptimizationCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano')
      }),
    ]
  },
  stats: {
    modules: false,
    source: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'DEV': JSON.stringify('production')
    }),
    new ProgressBarPlugin({
      callback: function (res) {
        console.log('打包成功，请在dist目录查看打包结果')
      }
    })
  ]
})