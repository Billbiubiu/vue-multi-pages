'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
/**-----添加部分开始-----**/
const merge = require('webpack-merge')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
/**
 * 获取入口js文件
 * @param dirPath 入口js路径
 */
exports.getEntries = () => {
  // js入口对应的路径
  const dirPath = './src/pages/*/*.js'; 
  let filePaths = glob.sync(dirPath);
  let entries = {};
  filePaths.forEach(filePath => {
    let fileName = path.basename(filePath, path.extname(filePath));
    entries[fileName] = filePath;
  })
  return entries;
}
/**
 * 生成多个HtmlWebpackPlugin，每个对应一个html页面
 */
exports.HtmlWebpackPlugins = () => {
  // js入口对应的路径
  const dirPath = './src/pages/*/*.js'; 
  const pages = exports.getEntries(dirPath);
  console.log(pages)
  let HtmlPlugins = [];
  for(let page in pages) {
    let config = {
      title: page,
      filename: 'pages/' + page + '/index.html',
      template: 'index.html',
      inject: true,
      chunks: ['manifest', 'vendor', page]
    };
    if (process.env.NODE_ENV === 'production') {
      config = merge(config, {
        minify: {
          removeComments: false,
          collapseWhitespace: false,
          removeAttributeQuotes: false
        },
        chunksSortMode: 'dependency'
      })
    }
    HtmlPlugins.push(new HtmlWebpackPlugin(config));
  }
  return HtmlPlugins;
}
/**-----添加部分结束-----**/