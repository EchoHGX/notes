# webpack4笔记

## 快速了解几个基本的概念

### mode 模式
通过选择 `development`, `production` 或 `none` 之中的一个，来设置 `mode` 参数，你可以启用 webpack 内置在相应环境下的优化。其默认值为 production。 
- development：开发模式,会将process.env.NODE_ENV 的值设为 development 。启用NamedChunksPlugin 和 NamedMoudulesPlugin。  
- production：生产模式，会将process.env.NODE_ENV 的值设为 production 。启用FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsFlagPlugin 和UglifyJsPlugin


```diff
// webpack.config.js
module.exports = {
	mode: 'production',
}
```

### 入口文件(entry)

入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

默认值`./src/index.js`，可以在 webpack 的配置文件中配置入口，配置节点为： `entry`,当然可以配置一个入口，也可以配置多个。

```diff
// webpack.config.js
module.exports = {
+	entry: './src/index.js' //单入口
}
```

```diff
// webpack.config.js
module.exports = {
	entry: {	//多入口
		main: './src/index.js',
		other: './src/other.js'
	} 
}
```


### 输出(output)

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件。

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

### loader

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

### 插件(plugins)

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。



## 安装webpack
使用webpack需要安装node.js，可直接在[node.js官网](https://nodejs.org)下载安装
```
//查看node是否安装成功
$ node -v 	//查看node版本 显示版本号表示安装完成
$ npm -v 		//查看npm版本 node内置npm   
//创建项目文件
$ mkdir webpack-test && cd webpack-test //新建一个项目文件夹webpack-test
$ npm init -y 	//创建一个默认的package.json文件[在项目文件夹下执行]
```

### 本地安装	
```
$ npm install webpack webpack-cli -D  //本地安装
```

### 全局安装【不推荐】
在全局状态下安装webpack
```
$ npm install webpack webpack-cli -g  //全局安装【不推荐全局安装
```
> 注意：不推荐全局安装 webpack。这会将你项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。

> 这里是使用npm来安装的，也可以使用cnpm,yarn


## 简单入门

项目结构
```
  webpack-test
+ |- package.json
+ |- /dist
+   |- index.html
+ |- /src
+   |- index.js
```
### webpack4支持 0 配置打包	 
项目根目录执行`[npx] webpack`会默认将src/index.js打包到dist/main.js

###	默认配置文件 
webpack4默认会在项目根目录找webpack.config.js或者webpackfile.js作为配置文件  
也可以通过--config指定配置文件，例如: webpack --config webpack.config.test.js

###	基础配置
项目根目录新建webpack.config.js文件
```js
//webpack.config.js
const path = require('path')

module.exports = {
	//入口文件
	entry: './src/index.js',
	//开发模式 开发:development, 生产:production
	mode: 'development',
	//出口文件
	output: {
		//打包完的文件名
    filename: "bundle.js",
    //打包后的路径
    path: path.resolve(__dirname,"dist"),
    //公共路径
    publicPath: '/',
	},
	//配置loader
	// module: {},
	//配置插件
	// plugins: []
}
```
- **entry** 入口文件  
```
//多入口
entry: {
	main: './src/index.js',
	other: './src/other.js'
} 
```
	
-	mode 模式  
development：开发模式，代码不压缩
production：生产模式，会压缩代码

- output 出口文件
```
//打包多入口文件，也可以通过[name]来生成不同的打包文件,
//[name]是entry中生成 通过[hash]可以生成hash戳
output: {
	filename: "bundle-[name].js",  //bundle-main.js  bundle-other.js
	path: path.resolve(__dirname,"dist"),  //修改path可以打包到对象的path文件夹下
}
```
通过上面webpack.config.js简单配置执行打包	`[npx] webpack`会将src/index.js打包到dist/bundle.js


###	webpack-dev-server
安装`yarn add webpack-dev-server -D`  
webpack-dev-server会通过express(node框架)启动一个http服务

配置devServer
```
//webpack.config.js
module.exports = {
	//开发服务器配置
	devServer: {
		port: 3000,//修改端口号
		progress: true,//进度条
		contentBase: './dist',//默认访问目录
		overlay: true,//是否在页面展示错误，（创建脚手架一般都会开启）
		hot: true, //热更新
		// open: true,//自动打开浏览器
	},
}
```


### 配置script
每次通过[npx] webpack等命令比较麻烦，可以配置script
```
//package.json
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",

  "scripts": {
  	"build": "webpack --config webpack.config.js",
  	"dev": "webpack-dev-server --config webpack.config.js"
  },

  "devDependencies": {
    "webpack": "^4.41.0",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.1"
  }
}
```
这样就可以通过`yarn build|dev` 或`npm run build|dev ` 执行相应的script


## 打包非js文件

### 打包html文件
安装`yarn add html-webpack-plugin -D`  
html-webpack-plugin可以将htm模板打包  

```
//webpack.config.js
const path = require('path')
const HtmlWabpackPlugin = require('html-webpack-plugin')

module.exports = {
	//入口文件
	entry: './src/index.js',
	//打包环境 开发:development, 生产:production
	mode: 'development',
	//出口文件
	output: {
		filename: "bundle.js",//打包完的文件名
		path: path.resolve(__dirname,"dist"),//打包后的路径
		publicPath: '/',//公共路径
	},
	//配置loader
	// module: {},
	//配置插件
	plugins: [
		new HtmlWabpackPlugin({
			template: './src/index.html',//打包html模板文件 源
			filename: 'index.html',//打包的文件名
			minify: {
				// removeAttrbuteQuotes: true,//删除双引号
				collapseWhitespace: true,//压缩成一行
			},
			// hash: true,//生成hash
		})
	]
}
```


### 处理样式

#### css-loader，style-loader
当引入css文件，webpack是无法识别的，这就需要使用相应的css插件|loader  
安装`yarn css-loader style-loader -D`  
css-loader 使webpack能够解析css  @import 'xx.css'  
style-loader 将css插入到html文件head标签中  

```
//配置loader
module: {
	rules: [
		//loader解析是从右向左执行
		//用法单一，一般一个loader处理一件事
		{
			test: /\.css$/,
			use: [
				{
				 	loader: 'style-loader',//把css插入head标签中 【对象形式，可以添加参数】
				 	options: {
				     // insertAt: 'top',//插入head位置 注:添加这个配置(还有wabpack文档中介绍的个别其他属性)报错，不明所以
				   }
				},
				{
					loader: 'css-loader'
				}
				// 'css-loader',//解析@import 【字符串形式】
			]
		}
	]
}
```
上面通过配置module的rules，通过正则匹配.css文件，陪通过use指定使用相应的loader  

**loader大致分以下几种**
- pre 前置loader		//设置loader可以添加options:{enforce:'pre'}
- normal 普通loader		//默认
- 内链loader	//import $ from 'expose-loader?$!jquery'
- post 后置loader		//设置loader可以添加options:{enforce:'postloader'}  

> loader解析是从右向左[从后往前]执行，也可以设置options修改执行顺序（options:{enforce:'pre'}优先执行）
> webpack需要先解析css，然后再插入到head标中，所以应该先配置style-laoder,再配置css-loader  
> 使用sass,less样式预处理，需要安装相应的loader（例如：sass-loader[看下面配置]，less类似),并配置在css-loader后面（需要先解析) 

#### 解析sass

配置`sass-loader`  
安装`yarn add sass-loader node-sass -D`
```
{
	test: /\.css$/,
	use: [
		{
		 	loader: 'style-loader',//把css插入head标签中 【对象形式，可以添加参数】
		 	options: {
		     // insertAt: 'top',//插入head位置 注:添加这个配置(还有wabpack文档中介绍的个别其他属性)报错，不明所以
		   }
		},
		{
			loader: 'css-loader'
		}
	+	'sass-loader'
	]
}

```

上面通过css-loader,style-loader可以将引入的css文件插入到html文件的head标签中,  


#### 抽离css到文件
还可以通过`mini-css-extract-plugin`插件将css抽离到文件中  
安装`yarn add mini-css-extract-plugin -D`  
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

plugins: [
	///***
	new MiniCssExtractPlugin({  //将样式抽离到文件中
		filename: 'main.css'
	})
],
module: {
	rules: [
		//loader解析是从右向左执行
		//用法单一，一般一个loader处理一件事
		{
			test: /\.css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader   
				},
				{
					loader: 'css-loader'
				}
				// 'css-loader',//解析@import 【字符串形式】
			]
		}
	]
}
```


#### css添加前缀
安装`yarn add postcss-loader autoprefixer -D`
css-loader后面添加postcss-loader
```
module: {
	rules: [
		//loader解析是从右向左执行
		//用法单一，一般一个loader处理一件事
		{
			test: /\.css$/,
			use: [
				{
					loader: MiniCssExtractPlugin.loader   
				},
				{
					loader: 'css-loader'
				}
				{
					loader: 'postcss-loader'
				}
			]
		}
	]
}
```
postcss-loader会在根目录查找postcss.config.js作为配置  
在根目录新建postcss.config.js文件  
```
//postcss.config.js
module.exports = {
	plugins: [
		require('autoprefixer')
	]
}
```




### 打包图片
安装`yarn add file-loader url-loader -D`
- js创建图片  
file-loader 默认会在内部生成一张图片，到build目录下，返回图片地址  

```
import logo from './logo.png' //引入图片，返回新的图片地址

let img = new Image();
img.src = logo;
document.body.appendChild(img);
``` 

- css中引入背景图片 可以直接引入  
background: url('./logo.png')  

- img标签引入 使用html-withimg-loader  
安装`yarn add html-withimg-loader -D`
```
//webpack.config.js
module: {
	rules: [
		{
			test: /\.html$/,
			use: 'html-withimg-loader'
		}
	]
}
```
配置图片相应loader
```
module: {
	rules: [
		{
			test: /\.(png|jpg|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10 * 1024,  //设置当图片小于10KB就转为base64
					outputPath: '/img/'  //图片打包到img文件下
				}
			}
		},
	]
}
```




## 开发相关辅助

### babel转码js

虽然现代的浏览器已经兼容了96%以上的ES6的语法了，但是为了兼容老式的浏览器，我们需要把最新的ES6的语法转成ES5的。这时就可以使用`babel-loader`了

安装`yarn add babel-loader @babel/core @babel/preset-env -D`  


配置
```
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader',
						options: {	//使用babel-loader es6 -> es5
							presets: [	//也可以在配置在外面[.babelrc文件中配置]
								[
									"@babel/preset-env",
									{
									  "targets": {
									    "chrome": "58",
									    "ie": "10"
									  }
									}
								]
							]
						}
					}
				]
			}
		]
	}
```  

targets配置的意思就是让babel根据你写入的兼容平台来做代码转换。  

#### 使用@babel/polyfill  
`includes`作为数组的实例方法，在某些浏览器其实是不支持的，babel默认的转换对于这种场景并不会做处理，同样不会处理的包括WeakMap, WeakSet, Promise等es6新引入的类，所以我们需要@babel/polyfill为我们这些实例方法等等打上补丁。  
安装`yarn add @babel/polyfill`  
很多项目会在入口文件顶部引入`@babel/polyfill`，或者指定webpack的entry为数组，第一项引入`@babel/polyfill`，这样配置是可以达到目录，但可能我们只使用了少量polyfill的api，这时全局引入就不太划算了，这时我们可以使用babel的useBuiltIns来配置。如下  

```
//这里配置在.babelrc文件(项目根目录中新建`.babelrc`文件)  
{
  "presets": [
    [
      "@babel/preset-env",
      {
	     	"useBuiltIns": "usage",
        "targets": {
          "chrome": "58",
          "ie": "10"
        }
      },
    ]
  ]
}
```
babel帮我们做好了代码分析，在需要用到polyfill的地方引入这个单独的补丁，这样就实现了按需引入  


#### class支持  
当打包如下简单代码
```
class A{
	a = 1 //报错
}
```
这时可以安装`yarn add @babel/plugin-proposal-class-properties -D`插件  
```json
//.babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
      	"useBuiltIns": "usage",
        "targets": {
          "chrome": "58",
          "ie": "10"
        }
      },
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties"
  ]
}
```

#### 装饰器@Decorator   
当处理以下代码时也是会报错  
```
@log  //报错
class A{
	a = 1 
}
function log(tag){
	console.log(tag)
}
```

安装相关插件`yarn add @babel/plugin-proposal-decorators -D`  
配置
```
//.babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
      	"useBuiltIns": "usage",
        "targets": {
          "chrome": "58",
          "ie": "10"
        }
      },
    ]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}

```

### Babel优化

babel-loader可以配置如下几个options：

- `cacheDirectory`：默认值为 false。当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。如果设置了一个空值 (loader: 'babel-loader?cacheDirectory') 或者 true (loader: babel-loader?cacheDirectory=true)，loader 将使用默认的缓存目录 node_modules/.cache/babel-loader，如果在任何根目录下都没有找到 node_modules 目录，将会降级回退到操作系统默认的临时文件目录。

- `cacheIdentifier`：默认是一个由 babel-core 版本号，babel-loader 版本号，.babelrc 文件内容（存在的情况下），环境变量 BABEL_ENV 的值（没有时降级到 NODE_ENV）组成的字符串。可以设置为一个自定义的值，在 identifier 改变后，强制缓存失效。

- `forceEnv`：默认将解析 BABEL_ENV 然后是 NODE_ENV。允许你在 loader 级别上覆盖 BABEL_ENV/NODE_ENV。对有不同 babel 配置的，客户端和服务端同构应用非常有用。

> 注意：sourceMap 选项是被忽略的。当 webpack 配置了 sourceMap 时（通过 devtool 配置选项），将会自动生成 sourceMap。

babel 在每个文件都插入了辅助代码，使代码体积过大.babel 对一些公共方法使用了非常小的辅助代码，比如 _extend。 默认情况下会被添加到每一个需要它的文件中。你可以引入 `babel runtime` 作为一个独立模块，来避免重复引入。
安装  
`yarn add @babel/plugin-transform-runtime -D`  
`yarn add @babel/runtime`  

> `@babel/plugin-transform-runtime`插件是帮我们把一些babel的辅助方法由直接写入代码专为按需引入模块的方式引用  

配置：

webpack.config.js

```js
rules: [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
    }
  }
]
```

修改`.babelrc`

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
      	"useBuiltIns": "usage",
        "targets": {
          "chrome": "58",
          "ie": "10"
        }
      },
    ]
  ],
  "plugins": [
  	["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    "@babel/plugin-transform-runtime"
  ]
}
```

此时，webpack打包的时候，会自动优化重复引入公共方法的问题。



### 资源打包不同文件夹下
- js  
```
output: {
  filename: "js/[name].js",//打包完的文件名
  path: path.resolve(__dirname,"dist"),//打包后的路径
  // publicPath: '',//公共路径
},
```
- css  
```
//css打包到css文件夹下
plugins:[
	new MiniCssExtractPlugin({  //将样式抽离到文件中
		filename: 'css/main.css'   //打包到css文件夹
	}),
]
```

- img  
```
module: {
	rules: [
		{
			test: /\.(png|jpg|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10 * 1024,  //设置当图片小于10KB就转为base64，否则用file-loader处理
					outputPath: '/img/'  //打包到img文件夹
				}
			}
		},
	]
}
```


### module 配置补充

模块(module): 这些选项决定了如何处理项目中的不同类型的模块。

webpack 模块可以支持如下:

- ES2015 import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句。
- 样式`(url(...))`或 HTML 文件`(<img src=...>)`中的图片链接`(image url)`

#### module.noParse

值的类型： RegExp | [RegExp] | function

防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。

```js
module.exports = {
  mode: 'devleopment',
  entry: './src/index.js',
  ...
  module: {
    noParse: /jquery|lodash/,
    // 从 webpack 3.0.0 开始,可以使用函数，如下所示
    // noParse: function(content) {
    //   return /jquery|lodash/.test(content);
    // }
  }
  ...
};
```

#### module.rules

创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。

```js
module.exports = {
  ...
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
  ...
};
```

#### module Rule

- Rule 条件详解
  - 字符串：匹配输入必须以提供的字符串开始。是的。目录绝对路径或文件绝对路径。
  - 正则表达式：test 输入值。
  - 函数：调用输入的函数，必须返回一个真值(truthy value)以匹配。
  - 条件数组：至少一个匹配条件。
  - 对象：匹配所有属性。每个属性都有一个定义行为。

#### Rule.test

- { test: Condition }：匹配特定条件。一般是提供一个正则表达式或正则表达式的数组，但这不是强制的。

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
  ...
};
```

其他的条件比如：

- `{ include: Condition }`:匹配特定条件。一般是提供一个字符串或者字符串数组，但这不是强制的。
- `{ exclude: Condition }`:排除特定条件。一般是提供一个字符串或字符串数组，但这不是强制的。
- `{ and: [Condition] }`:必须匹配数组中的所有条件
- `{ or: [Condition] }`:匹配数组中任何一个条件
- `{ not: [Condition] }`:必须排除这个条件

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "app/styles"),
          path.resolve(__dirname, "vendor/styles")
        ],
        use: ['style-loader', 'css-loader']
      }
    ]
  }
  ...
};
```

#### Rule.use

应用于模块指定使用一个 loader。

Loaders can be chained by passing multiple loaders, which will be applied from right to left (last to first configured).

加载器可以链式传递，从右向左进行应用到模块上。

```js
use: [
  'style-loader',
  {
    loader: 'css-loader'
  },
  {
    loader: 'less-loader',
    options: {
      noIeCompat: true
    }
  }
];
```

> 传递字符串（如：use: [ "style-loader" ]）是 loader 属性的简写方式（如：use: [ { loader: "style-loader "} ]）。



### 清理 dist 目录

每次构建，我们的 `/dist` 文件夹都会保存生成的文件，然后就会非常杂乱。

通常，在每次构建前清理 `/dist` 文件夹，是比较推荐的做法

`clean-webpack-plugin` 是一个比较普及的管理插件，让我们安装和配置下。

```sh
yarn add clean-webpack-plugin -D
```

webpack.config.js

```diff
  const path = require('path');
  ....
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin()
      ...
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
    ...
  };
```

现在执行 `npm run build`，再检查 `/dist` 文件夹。如果一切顺利，你现在应该不会再看到旧的文件，只有构建后生成的文件！

> *由于最新版本变化@2.0.1*之前的写法已经不能使用：`new CleanWebpackPlugin(['/dist'])`。
> 官方文档地址：[https://www.npmjs.com/package/clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)
> 可以直接设置一个对象参考： 
> `new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*']})`



### 压缩代码
css使用optimize-css-assets-webpack-plugin插件，  
js使用uglifyjs-webpack-plugin插件  
安装`yarn add optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D`  
配置
```
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
	optimization: { //配置优化项
		minimizer: [
			new OptimizeCssAssetsWebpackPlugin(),
			new UglifyjsWebpackPlugin()
		]
	}
	//也可以配置插件
	//plugins: [
	//	new OptimizeCssAssetsWebpackPlugin(),
	//	new UglifyjsWebpackPlugin()
	//]
}
```

### 定义环境变量
使用webpack.DefinePlugin插件可以定义变量
例如：

```
//webpack.config.js
plugins: [
	new webpack.DefinePlugin({
		DEV: JSON.stringify('dev'),    //定义字符串时，不能直接使用'dev'，取结果:dev
	})
]

```

```
//index.js
if(DEV){
	***
}
```


### webpack-merge合并配置文件  
可以为不同环境配置不同的配置文件，比如有  
webpack.base.js //基础配置文件  
webpack.dev.js  //开发环境配置  
webpack.prod.js //生产环境配置  

```
//webpack.dev.js
let { smart } = reqiure('webpack-merge')
let base = require('./webpack.base.js')

module.exports = smart(base,{
	mode: 'development',
	//其他配置
})
```

```
//webpack.prod.js
let { smart } = reqiure('webpack-merge')
let base = require('./webpack.base.js')

module.exports = smart(base,{
	mode: 'production',
	//其他配置
})
```

### 全局变量
当我们引入第三方模块时，该模块作用域只在当前模块中。当需要设置全局时，可以添加loader处理  
`yarn add expose-loader -D`

```
import $ from 'jquery'
console.log(window.$)  // -> underfine   【全局访问不到】
```

```
import $ from 'expose-loader?$!jquery'  //通过expose-loader将jquery导出为全局($)
console.log(window.$) // ƒ ( selector, context ) { *** }    【全局变量】

//或者配置webpack.config.js
module: {
	rules: [
		{
			test: require.reslove('jqeury'),
			use: 'expose-loader?$'
		}
	]
}
```
另外还可以通过webpack.ProvidePlugin插件，让每个模块都插入某变量|模块
```
//webpack.config.js
const webpack = require('webpack')

plugins: [
	new webpack.ProvidePlugin({
		$: 'jquery'			//在每个模块都注入$(jquery)
	})
]
```

### webpack跨域
- 代理  
```
devServer: {
	proxy: {
		'/api':{
			target: 'http:localhost:8081', 
			pathRewrite: {
				'/api': ''  //重写路径
			}
		}
	}
}
//接口：http:localhost:8081/user
//webpack服务http:localhost:8080
//以上配置，当请求'/api/user',直接转化了到http:localhost:8081/user
```

- mock数据  
```
devServer: {
	before(app){
		app.get('/user',(req,res) => {
			res.json({code: 200,msg: '成功'})
		})
	}
}
```

- 使用webpack-dev-middleware  
安装`yarn add webpack-dev-middleware`  

```js
//server.js
let express = require('express')
let app = express();
let webpack = require('webpack')

//中间件
let middle = require('webpack-dev-middle')
//引入配置文件
let config = require('./webpack.config.js')
//处理配置文件
let compiler = webpack(config)
//使用中间件，当开启服务的时候，将webpack服务也一并开启
app.use(middle(compiler))


app.get('/user',(req,res) => {
	res.json({code: 200,msg: '成功'})
})

app.listen(300)
```


### devtool映射文件
通过配置devtool可以配置映射文件  
- source-map  
单独生成source-map文件，出错显示行和列  
devtool: 'source-map'  

- eval-source-map  
不会生成单独的文件，出错会显示行和列  
devtool: 'eval-source-map'  

- cheap-module-source-map  
不产生列，但是一个单独映射文件（和文件没有关联）。可以保存起来调试使用  
devtool: 'cheap-module-source-map'  

- cheap-module-eval-source-map  
不生成文件，集成到打包后的文件中，不显示列  
devtool: 'cheap-module-eval-source-map'  



### watch监听（热更新）
当代码修改时，可以时时打包。
devServer也可以实现重新打包，但感觉有点慢
```
module.exports = {
	devServer: {
		hot: true, //热更新
	}
}
```
配置watch  
```
module.exports = {
	watch: true,
	watchOptions: {  //监控选项
		poll: 1000,//1分钟询问1000次
		aggregateTimeout: 500,//防抖 输入停止后500ms后打包文件
		ignored: /node_module/, //不监控的文件
	}
}
```

## 解析(resolve)

配置模块如何解析。比如： `import _ from 'lodash'` ,其实是加载解析了lodash.js文件。此配置就是设置加载和解析的方式。

- `resolve.alias`

创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块：

```diff
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, './dist')
  },
+ resolve: {
+   alias: {
+     vue$: path.resolve(__dirname, 'src/lib/vue/dist/vue.esm.js'),
+     '@': path.resolve(__dirname, 'src/')
+   }
+ }
  ...
}

// index.js
// 在我们的index.js文件中，就可以直接import
import vue from 'vue';
// 等价于
import vue from  'src/lib/vue/dist/vue.esm.js';

```

- `resolve.extensions`的应用

自动解析确定的扩展。

```diff
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    alias: {
      vue$: path.resolve(__dirname, 'src/lib/vue/dist/vue.esm.js'),
      '@': path.resolve(__dirname, 'src/')
    },
+   extensions: [".js", ".vue",".json"]   // 默认值: [".js",".json"]
  }
  ...
}
```

> 给定对象的键后的末尾添加 $，以表示精准匹配

- resolve一般配置  
```
//webpack.config.js
module.exports = {
	resolve: { //解析第三方包
		modules: [
			path.resolve('node_modules'), 	//在当前node_modules文件查找包
		],
		mainFields: [ //查找字段 
			'style',
			'main'
		],
		mainfiles: [  //入口文件名字
			'index.js'
		],
		alias: { //别名
			bootstrap: 'bootstrap/dist/css/bootstrap.css'
		},
		extensions: [ //添加后缀  当import xx from './xx'
			'.js',   //先找xx.js
			'.css'	 //没找到再找xx.css
		]
	}
}
```


## 外部扩展(externals)

externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。 [文档](https://webpack.docschina.org/configuration/externals/)

例如，从 CDN 引入 jQuery，而不是把它打包：

index.html

```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

webpack.config.js

```diff
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  alias: {
    extensions: [".js", ".vue",".json"]   // 默认值: [".js",".json"]
    vue$: path.resolve(__dirname, 'src/lib/vue/dist/vue.esm.js'),
    '@': path.resolve(__dirname, 'src/')
  },
+ externals: {
+   jquery: 'jQuery'
+ },
  ...
}
```

这样就剥离了那些不需要改动的依赖模块，换句话，下面展示的代码还可以正常运行：

```js
import $ from 'jquery';

$('.my-element').animate(...);
```

具有外部依赖(external dependency)的 bundle 可以在各种模块上下文(module context)中使用，例如 CommonJS, AMD, 全局变量和 ES2015 模块。外部 library 可能是以下任何一种形式：

- root：可以通过一个全局变量访问 library（例如，通过 script 标签）。
- commonjs：可以将 library 作为一个 CommonJS 模块访问。
- commonjs2：和上面的类似，但导出的是 module.exports.default.
- amd：类似于 commonjs，但使用 AMD 模块系统。

不同的配置方式：

```js
externals : {
  react: 'react'
}

// 或者

externals : {
  lodash : {
    commonjs: "lodash",
    amd: "lodash",
    root: "_" // 指向全局变量
  }
}

// 或者

externals : {
  subtract : {
    root: ["math", "subtract"]   // 相当于： window.math.substract
  }
}
```

## 构建目标(targets)

webpack 能够为多种环境或 target 构建编译。想要理解什么是 target 的详细信息，请阅读 target 概念页面。

`target`: 告知 webpack 为目标(target)指定一个环境。

可以支持以下字符串值：

选项|描述
---|---
async-node|编译为类 Node.js 环境可用（使用 fs 和 vm 异步加载分块）
electron-main|编译为 Electron 主进程。
electron-renderer|编译为 Electron 渲染进程，使用 JsonpTemplatePlugin, FunctionModulePlugin 来为浏览器环境提供目标，使用 NodeTargetPlugin 和 ExternalsPlugin 为 CommonJS 和 Electron 内置模块提供目标。
node|编译为类 Node.js 环境可用（使用 Node.js require 加载 chunk）
node-webkit|编译为 Webkit 可用，并且使用 jsonp 去加载分块。支持 Node.js 内置模块和 nw.gui 导入（实验性质）
web|编译为类浏览器环境里可用（默认）
webworker|编译成一个 WebWorker

例如，当 target 设置为 "electron"，webpack 引入多个 electron 特定的变量.

webpack.config.js

```diff
// webpack.config.js
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, './dist')
  },
  alias: {
    extensions: [".js", ".vue",".json"]   // 默认值: [".js",".json"]
    vue$: path.resolve(__dirname, 'src/lib/vue/dist/vue.esm.js'),
    '@': path.resolve(__dirname, 'src/')
  },
  externals: {
    jquery: 'jQuery'
  },
+ target: 'node'
  ...
}
```



## 相关的loader列表

`webpack` 可以使用 loader 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。

### 文件

- `raw-loader` 加载文件原始内容（utf-8）
- `val-loader` 将代码作为模块执行，并将 exports 转为 JS 代码
- `url-loader` 像 file loader 一样工作，但如果文件小于限制，可以返回 [data URL](https://tools.ietf.org/html/rfc2397)
- `file-loader` 将文件发送到输出文件夹，并返回（相对）URL

### JSON

- `json-loader` 加载 [JSON](http://json.org/) 文件（默认包含）
- `json5-loader` 加载和转译 [JSON 5](https://json5.org/) 文件
- `cson-loader` 加载和转译 [CSON](https://github.com/bevry/cson#what-is-cson) 文件

### 转换编译(Transpiling)

- `script-loader` 在全局上下文中执行一次 JavaScript 文件（如在 script 标签），不需要解析
- `babel-loader` 加载 ES2015+ 代码，然后使用 [Babel](https://babeljs.io/) 转译为 ES5
- `buble-loader` 使用 [Bublé](https://buble.surge.sh/guide/) 加载 ES2015+ 代码，并且将代码转译为 ES5
- `traceur-loader` 加载 ES2015+ 代码，然后使用 [Traceur](https://github.com/google/traceur-compiler#readme) 转译为 ES5
- [`ts-loader`](https://github.com/TypeStrong/ts-loader) 或 [`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader) 像 JavaScript 一样加载 [TypeScript](https://www.typescriptlang.org/) 2.0+
- `coffee-loader` 像 JavaScript 一样加载 [CoffeeScript](http://coffeescript.org/)

### 模板(Templating)

- `html-loader` 导出 HTML 为字符串，需要引用静态资源
- `pug-loader` 加载 Pug 模板并返回一个函数
- `jade-loader` 加载 Jade 模板并返回一个函数
- `markdown-loader` 将 Markdown 转译为 HTML
- [`react-markdown-loader`](https://github.com/javiercf/react-markdown-loader) 使用 markdown-parse parser(解析器) 将 Markdown 编译为 React 组件
- `posthtml-loader` 使用 [PostHTML](https://github.com/posthtml/posthtml) 加载并转换 HTML 文件
- `handlebars-loader` 将 Handlebars 转移为 HTML
- [`markup-inline-loader`](https://github.com/asnowwolf/markup-inline-loader) 将内联的 SVG/MathML 文件转换为 HTML。在应用于图标字体，或将 CSS 动画应用于 SVG 时非常有用。

### 样式

- `style-loader` 将模块的导出作为样式添加到 DOM 中
- `css-loader` 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- `less-loader` 加载和转译 LESS 文件
- `sass-loader` 加载和转译 SASS/SCSS 文件
- `postcss-loader` 使用 [PostCSS](http://postcss.org) 加载和转译 CSS/SSS 文件
- `stylus-loader` 加载和转译 Stylus 文件

### 清理和测试(Linting && Testing)

- `mocha-loader` 使用 [mocha](https://mochajs.org/) 测试（浏览器/NodeJS）
- [`eslint-loader`](https://github.com/webpack-contrib/eslint-loader) PreLoader，使用 [ESLint](https://eslint.org/) 清理代码
- `jshint-loader` PreLoader，使用 [JSHint](http://jshint.com/about/) 清理代码
- `jscs-loader` PreLoader，使用 [JSCS](http://jscs.info/) 检查代码样式
- `coverjs-loader` PreLoader，使用 [CoverJS](https://github.com/arian/CoverJS) 确定测试覆盖率

### 框架(Frameworks)

- `vue-loader` 加载和转译 [Vue 组件](https://vuejs.org/v2/guide/components.html)
- `polymer-loader` 使用选择预处理器(preprocessor)处理，并且 `require()` 类似一等模块(first-class)的 Web 组件
- `angular2-template-loader` 加载和转译 [Angular](https://angular.io/) 组件
- Awesome 更多第三方 loader，查看 [awesome-webpack 列表](https://github.com/webpack-contrib/awesome-webpack#loaders)。

###	其他小插件
- cleanWebpackPlugin  
每次打包会先删除文件  
```
let CleanWebpackPlugin = require('clean-webpack-pulgin')
plugins: [
	new CleanWebpackPlugin('./dist'), //每次打包会先删除dist文件夹，可以传数组['./dist','./assets']
]
```
- copyWebpackPlugin  
拷贝插件
```
let CopyWebpackPlugin = require('copy-webpack-pulgin')
plugins: [
	new CopyWebpackPlugin([
		{from: 'md',to:''},// 将md文件夹的内容拷贝到打包目录下
	]),
]
```
- bannerPlugin  //webpack内置插件  
版权申明插件
```
let webpack = require('webpack')
plugins: [
	new webpack.BannerPlugin('make by 2020 Echo'), //打包出来的每个js文件头部都会插入 /*make by 2020 Echo*/
]
```

## 打包分析

`webpack-bundle-analyzer`插件可以帮助我们分析打包后的图形化的报表。

> 仅仅在开发环境使用。

安装`yarn add  webpack-bundle-analyzer -D`


```diff
+ const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports = {
    plugins: [
+     new BundleAnalyzerPlugin()
    ]
  }
```

自动生成一个网页报表，如下所示：
![图片](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)


## 优化

### webpack自带优化

- tree_shaking  

使用import语法导入模块，只会打包用了的方法（删除掉没使用的代码）

例如：
```
//test.js
let fun1 = () => {}
let fun2 = () => {}
module.exports = {fun1,fun2}

//index.js
import test from './test.js'

test.fun1();//这里只用了fun1方法，当使用import导入，生产环境打包时fun2函数（没使用）并不会打包

```
使用es6（require)导入会把结果放到default  
```
let test = require('./test.js')  
test.default.fun1()  
```

- 省略无用代码  
```
let a = 1,b = 2;  
console.log(a+b);
打包后：console.log(3)
```

### 动态链接库
使用webpack内置插件`dllPulgin`  

当引入`react`,`react-dom`，打包会将其一起打包到一个文件夹，这样文件会比较大。  
我们可以将`react`,`react-dom`打包到单独文件，或称为动态连接库，并在html文件中引入该文件  

```
//新建webpack.react.js配置文件，用于打包react,react-dom
let path = require('path')
let webpack = require('webpack')

module.exports = {
	entry: {
		react: ['react','react-dom']
	},
	output: {
		filename: '_dll_[name].js', 
		path: path.resolve(__dirname,'dist'), 
		library: '_dll_[name]',   //打包的js前面添加 var _dll_react = (原先打包内容)
		// libraryTarget: 'var', //添加方式 var: var dll = ***; commmonjs: exports(dll) = ***; ...
	},
	mode: 'development',
	devServer: {
		port:3000,
		contentBase: './dist',
	},
	plugins: [
		new webpack.DllPlugin({
			name: '_dll_[name]',
			path: path.resolve(__dirname,'dist','manifest.json')
		})
	]
}
```  
打包完dist文件下生成`_dll_react.js`和`manifest.json`两文件
然后在html文件中引入_dll_react.js

```
//项目文件
import React from 'react'
import { render } from 'react-dom'
```
项目中引入的`react`,`react-dom`还是会打包，所以需要添加配置，告知到动态连接库中查找  
```
//项目正式配置文件webpack.config.js
let path = require('path')
let HtmlWebpackPulgin = require('html-webpack-plugin')
let webpack = require('webpack')
module.exports = {
	//配置多入口
	entry: {
		main: './src/react.js'
		// other: './src/other.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname,'dist')
	},
	mode: 'production',
	devServer: {
		port:3000,
		contentBase: './dist'
	},
	plugins: [
		new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname,'dist','manifest.json')
		}),
		new HtmlWebpackPulgin({
			template: './src/index.html',
			filename: 'index.html',
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react'
						]
					}
				},
				include: /src/,
				exclude: /node_modules/
			}
		]
	}
}
```

> 还有前面提到的externals可以设置不打包的模块，CDN引入。


### happypack多线程打包
安装`yarn add happypack -D`  
```
//webpack.config.js
let Happypack = require('happypack')
module.exports = {

	module: {
		rules: [
			{
				test:　/\.js$/,
				use: 'Happypack/loader?id=js'
			},
			{
				test:　/\.css$/,
				use: 'Happypack/loader?id=css'
			}
		]
	},
	plugins: [
		new Happypack({
			id: 'js',
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react'
						]
					}
				}
			]
		}),
		new Happypack({
			id: 'css',
			use: [
				MiniCssExtractPlugin.loader, 
				"css-loader", 
				"postcss-loader"
			]
		})
	]
}

```



### 抽离公共模块
```
//webpack.config.js
module.exports = {
	optimization: {
		splitChunks: {	//分割代码块
			cacheGroups: {	//缓存组
				common: {	//公共模块
					chunks: 'initial', //入口处开始
					minSize: 0,	//大于0的公用代码块
					minChunks: 2, 	//公用了2次以上
				}
				vendor: {  //第三方
					priority: 1, //优先抽离
					test: /node_modules/,
					chunks: 'initial', //入口处开始
					minSize: 0,	//大于0的公用代码块
					minChunks: 2
				}
			}

		}
	}
}
```
更过`optimization`配置请看[webpack文档](https://webpack.docschina.org/configuration/optimization/)  


## 最后
该笔记查看了[webpack官方文档](https://webpack.docschina.org/concepts/)，视频，以及借鉴了[老马webpack入门笔记](https://malun666.github.io/aicoder_vip_doc/#/pages/vip_2webpack?id=webpack-%e5%85%a5%e9%97%a8%e6%95%99%e7%a8%8b)。然后自己配置后，为了检验所学以及巩固所写的笔记。如有错误，欢迎在github提issue。