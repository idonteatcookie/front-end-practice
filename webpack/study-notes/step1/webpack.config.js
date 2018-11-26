var path = require('path'); // node 内置模块

module.exports = {
    entry: './src/index.js', // 入口文件 相当于 entry: { main: './src/index.js' }

    output: { // 出口
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}