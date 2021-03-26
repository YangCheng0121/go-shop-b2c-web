const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProd ? './' : '/',
  assetsDir: './',
  devServer: {
    port: 8081
  },
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  chainWebpack: (config) => {
    /**
     * 设置别名
     */
    config.resolve.alias
      .set('@$', resolve('src'))

    /**
     * 配置 public/index.html 的 htmlWebpackPlugin.options.title
     */
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'GoShopB2C'
        return args
      })
  }
}
