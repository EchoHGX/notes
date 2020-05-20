const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const config = require('../config')
const utils = require('./utils')



module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname,'./dist'),
    host: config.dev.host,
    port: config.dev.port,
    hot: true,
    compress: true,
    noInfo: true,
    // 在浏览器显示错误和警告
    overlay: {
      warnings: true,
      errors: true
    },
    // 去除掉每次修改时，控制台的日志
    clientLogLevel: 'none'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  }, 
  plugins: [
    // 注入到webpack，添加环境变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`项目成功启动，地址是 http://${config.dev.host}:${config.dev.port}`]
      }
    }),
    new HtmlWebpackPlugin({
      title: 'hello world',
      filename: 'index.html',
      template: './src/index.html',
      inject: true
    })
  ]
})