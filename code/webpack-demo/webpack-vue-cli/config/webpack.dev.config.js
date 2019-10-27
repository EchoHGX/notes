const webpack = require('webpack')
const path = require('path')
const baseConfig = require('./webpack.base.config')
const merge = require('webpack-merge')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname,'./dist'),
    host: 'localhost',
    port: 3003,
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
  plugins: [
    // 注入到webpack，添加环境变量
    new webpack.DefinePlugin({
      'DEV': JSON.stringify('development')
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['项目成功启动，地址是localhost:8080']
      }
    })
  ]
})