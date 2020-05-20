const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://api.xxx.com', // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true,
        secure: false, // 如果是https接口，需要配置这个参数为true
        pathRewrite: { // url重写，这里100.75.21.153:16226为示例ip、端口
          '^/test': '/test'
        }
      },
    },
    cacheBusting: true,
    cssSourceMap: false,
    host: 'localhost',
    port: 3003,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: false,
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error
    // overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: './',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    devtool: '#source-map',
  }
}