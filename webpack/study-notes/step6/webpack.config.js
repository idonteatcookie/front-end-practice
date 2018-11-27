var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var SpritesmithPlugin = require('webpack-spritesmith');

module.exports = {
    entry: {
        app: './src/index.jsx'
    },

    output: { // 出口
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js'
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
            },
            {
                test: /\.less$/,
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader', // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            javascriptEnabled: true
                        }
                    }],
                    publicPath: "../"
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    resolve: { // 代码模块路径解析的配置
        modules: [
            'node_modules',
            'spritesmith-generated', // webpack-spritesmith 生成所需文件的目录
        ],
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
        }),
        new ExtractTextPlugin('./css/[name].[contenthash].css'),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'images'), // 多个图片所在的目录
                glob: '*.png' // 匹配图片的路径
            },
            target: {
                // 生成最终图片的路径
                image: path.resolve(__dirname, 'src/spritesmith-generated/sprite.png'),
                // 生成所需 less 代码
                css: path.resolve(__dirname, 'src/spritesmith-generated/sprite.less'),
            },
            apiOptions: {
                cssImageRef: "~sprite.png"
            }
        })
    ],

    devServer: {
        host: 'localhost',
        port: 8888,
        open: true // 自动打开浏览器
    }
}