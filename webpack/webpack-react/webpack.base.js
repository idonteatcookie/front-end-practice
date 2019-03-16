const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * 配置入口文件
   * 相当于
   * entry { main: './src/index.js' }
   * 可以配置多个入口
   */
  entry: './src/index.js',

  /**
   * 配置输出路径和文件名
   */
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      /**
       * 配置 babel-loader 来使用 ES6 和 react 语法
       * test 和 include/exclude 指定作用的文件
       * use 指定 loader 和相关配置
       */
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src') // 指定哪些路径下的文件需要经过 babel-loader 处理
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },

  plugins: [
    /**
     * 将打包好的js和css文件在指定html文件中自动引入
     */
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html'
    }),
    /**
     * 复制文件 不经过webpack处理 直接复制到指定目录
     * from 配置来源，to 配置目标路径
     */
    new CopyWebpackPlugin([
      { from: 'src/assets/favicon.ico', to: 'favicon.ico' }
    ])
  ],

  /**
   * 配置代码的解析路径
   */
  resolve: {
    /**
     * 配置路径别名
     */
    alias: {
      '@src': path.resolve(__dirname, 'src')
    },
    extensions: [".js", ".jsx"]
  }

}