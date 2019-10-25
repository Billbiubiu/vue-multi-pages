
## 动态数据可视化系统

1. [原理分析](#step-1)
2. [结构调整](#step-2)
3. [配置修改](#step-3)
4. [注意事项](#step-4)

<h3 id="step-1">1. 原理分析</h3>

  多页面的本质是新增多个入口，并为每个入口生成单独的`.html`页面并引入对应的`.js`文件。

<h3 id="step-2">2. 结构调整</h3>

1. 添加多个入口：
  删除原有入口`src/main.js`，新建`pages`目录，在`pages`目录下添加每个页面对应的目录。
2. 调整后src目录结构：
  ├── src
      ├── assets
      │   └── logo.png
      ├── components
      ├── pages
      │   ├── demo
      │   │   ├── demo.js
      │   │   └── demo.vue
      │   └── index
      │       ├── index.js
      │       └── index.vue
      └── App.vue
<h3 id="step-3">3. 配置修改</h3>

1. 安装`glob`模块：
  使用`npm install glob --dev`，该模块用于匹配所有的入口路径
1. `build/utils.js`：
  添加`getEntries`和`getHtmlPlugins`函数。
2. `build/webpack.base.conf.js`：
  将原有的`entry: './src/main.js'`替换为`entry: utils.getEntries('./path/to/entries')`，每一个入口文件都会被打包成一个单独的`.js`文件。
3. `build/webpack.dev.conf.js`和`build/webpack.prod.conf.js`：
  注释原有的`HtmlWebpackPlugin`，在`plugins`数组后`concat`使用`utils.getHtmlPlugins('./path/to/entries')`生成的`HtmlWebpackPlugins`，每一个`HtmlWebpackPlugin`都会生成一个`html`文件即一个单独的页面，并引入对应的`.js`文件。
4. `config/index.js`：
  如出现打包后页面引用的资源路径错误，应根据页面到`static`目录的相对路径对`dev.assetsPublicPath`和`build.assetsPublicPath`进行修改，一般不需要修改。


<h3 id="step-4">4. 注意事项</h3>

1. 由于`demo.js`和`demo.vue`文件同名，所以在`demo.js`文件中引入`demo.vue`时，`demo.vue`后缀名不可省略，否则无法正确引入组件。