const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge.smart(baseConfig, {
  mode: 'development',

  module: {
    rules: [
      /**
       * 将 eslint-loader 设置为前置 loader
       * 因为 eslint 检查的是未经处理的源代码
       * 要保证最先进行处理
       * 通过 npx eslint --init 命令初始化一个 eslint 配置文件
       */
      {
        enforce: "pre",
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: "eslint-loader",
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      /**
       * 处理图片
       */
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    /**
     * 用于创建一些在编译时可以配置的全局常量
     */
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(true)
    })
  ],

  devServer: {
    port: '8888',
    hot: true,
    before(app) {
      // mock
      app.get('/api/test', function(req, res) {
        res.json({ code: 200, message: 'hello world' })
      })
    }
  }

});