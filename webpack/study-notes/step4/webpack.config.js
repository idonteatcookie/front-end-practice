var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.jsx'
    },

    output: { // 出口
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js',
    },

    module: { // 配置loader
        rules: [
            {
                test: /\.jsx?/,             // 正则表达式 匹配文件名
                exclude: /node_modules/,    // exclude 表示排除的路径 也可以添加 include 字段设置匹配路径
                use: {
                    loader: 'babel-loader', // 对符合上面约束条件的文件 使用的 loader
                    options: {
                        presets: ['env', 'react'],
                        plugins: ['transform-runtime']
                    }
                }
            }
        ]
    },

    resolve: { // 代码模块路径解析的配置
        extensions: ['.js', '.jsx'] // 进行模块路径解析时，webpack 会尝试补全后缀名来进行查找
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // 生成文件名
            template: 'index.html'  // 模板
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', // 使用 vendor 入口作为公共部分
            filename: "js/[name].[chunkhash].js",
            minChunks: (module, count) => {
                return module.context && module.context.includes("node_modules");
            }
        })
    ],

    devServer: {
        host: 'localhost',
        port: 8888,
        open: true // 自动打开浏览器
    }
}