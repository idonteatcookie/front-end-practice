const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  // mode: 'production'
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
    filename: '[name].[chunkhash].js'
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
      },
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
        loader: "eslint-loader"
      },
      /**
       * v4 以后使用 mini-css-extract-plugin 代替 extract-text-webpack-plugin
       * style-loader 是把样式通过 js 生成样式插入到 html 
       * MiniCssExtractPlugin 是提取样式到文件
       * 所以使用 MiniCssExtractPlugin 就不需要 style-loader 了
       * css-loader 处理 css 文件的引用 @import and url() like import/require()
       * postcss-loader 配置见文件 postcss.config.js 自动添加浏览器前缀
       */
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          },
        ],
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
     * 提取css到指定文件
     */
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      // chunkFilename: "[id].css"
    }),
    /**
     * 打包前删除之前的生成文件
     * 默认删除 <PROJECT_DIR>/dist/ 下的所有文件
     */
    new CleanWebpackPlugin(),
    /**
     * 用于创建一些在编译时可以配置的全局常量
     */
    new webpack.DefinePlugin({
      VERSION: JSON.stringify('5fa3b9')
      // 如果指定了 mode 会自动添加变量 process.env.NODE_ENV = mode
      // "process.env.NODE_ENV": JSON.stringify("production")
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
    /**
     * 搜索模块路径的目录
     */
    modules: [
      "node_modules"
    ],
    // 查找路径是自动添加的文件后缀
    // 减少配置以防降低查找效率
    extensions: [".js", ".jsx"]
  },

  optimization: {
    // mode 为 production 时
    // 默认开启压缩
    // minimize: true
    // 可以通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    minimizer: [new UglifyJsPlugin()],
  },

}