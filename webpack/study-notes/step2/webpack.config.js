var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // 入口

    output: { // 出口
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    module: { // 配置loader
        rules: [
            {
                test: /\.jsx?/,             // 正则表达式 匹配文件名
                exclude: /node_modules/,    // exclude 表示排除的路径 也可以添加 include 字段设置匹配路径
                use: {
                    loader: 'babel-loader', // 对符合上面约束条件的文件 使用的 loader
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // 生成文件名
            template: 'index.html'  // 模板
        })
    ]
}