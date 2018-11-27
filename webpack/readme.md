# webpack 学习笔记
webpack 本质上是一个打包工具，它会根据代码的内容解析模块依赖，帮助我们把多个模块的代码打包。webpack 会把我们项目中使用到的多个代码模块（可以是不同文件类型），打包构建成项目运行仅需要的几个静态文件。

## 安装
在项目中安装 webpack `npm install webpack webpack-cli -D`

webpack-cli 是使用 webpack 的命令行工具，在 4.x 版本之后不再作为 webpack 的依赖了，我们使用时需要单独安装这个工具。

## 配置文件
默认是 项目下的 `webpack.config.js`

## 入口
在多个代码模块中会有一个起始的 .js 文件，这个便是 webpack 构建的入口。webpack 会读取这个文件，并从它开始解析依赖，然后进行打包。默认的入口文件是 ./src/index.js。

入口可以使用 entry 字段来进行配置，webpack 支持配置多个入口来进行构建

## loader
webpack 中提供一种处理多种文件格式的机制，便是使用 loader。我们可以把 loader 理解为是一个转换器，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块。

可以在 `module.rules` 字段下来配置相关的规则

## plugin
在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。可以这么理解，模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成。通过添加我们需要的 plugin，可以满足更多构建中特殊的需求。例如，要使用压缩 JS 代码的 uglifyjs-webpack-plugin 插件，只需在配置中通过 plugins 字段添加新的 plugin 即可

## 输出
webpack 的输出即指 webpack 最终构建出来的静态文件。当然，构建结果的文件名、路径等都是可以配置的，使用 `output`字段。默认创建的输出内容就是 `./dist/main.js`。





