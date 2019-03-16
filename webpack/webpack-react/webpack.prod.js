const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge.smart(baseConfig, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js'
  },

  module: {
    rules: [
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
       * 处理图片并压缩
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
          {
            loader: 'image-webpack-loader'
          },
        ]
      }
    ]
  },

  plugins: [
    /**
     * 提取css到指定文件
     */
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].css"
    }),
    /**
     * 打包前删除之前的生成文件
     * 默认删除 <PROJECT_DIR>/dist/ 下的所有文件
     */
    new CleanWebpackPlugin()
  ],

  optimization: {
    // mode 为 production 时
    // 默认开启压缩
    // minimize: true
    // 可以通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin({}) // 压缩 CSS 代码
    ],
    // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    splitChunks: {
      chunks: "all",
    }
  }

});