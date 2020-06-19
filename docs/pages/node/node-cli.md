# 手把手教你写node cli

> 做为一个前端，总会遇到各种node脚手架，像webpack，vue-cli, create-react-app等等。对于这些脚手架，相信大家一定都不陌生，也一定想过它是怎样实现的(我就想过)。其实node的cli本质上就是跑node脚本,每个前端都会。像执行一个js文件`node index.js`,会执行package.json里的scripts 

**相关库**   
cli需要获取用户的输入，选择并做相应的事情，就需要使用到一些库来帮忙我们更方便的写cli  

- commander - 处理核心命令
- chalk  —  美化终端字符显示
- figlet  —  在终端输出大型字符
- inquirer  —  命令行参数输入交互
- shelljs  —  平台相关命令
- ora - 实行loading效果
- download-git-repo - 下载git模块

## 初始化  

```
// 初始化项目
$ mkdir ech-cli
$ cd ech-cli
$ npm init -y
```  
这样我们就创建了一个ech-cli文件，里面有个默认配置的package.json文件
```json
{
  "name": "ech-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```  
## 创建可执行文件  
一般地如果需要通过node跑脚本都会执行`node xxx`，我们也可以在package.json中添加bin指定可执行文件
```
{
  "name": "ech-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "ech": "./bin/ech"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```  
接着在创建文件夹bin并添加ech文件，ech文件头部`#!/usr/bin/env node`来告诉系统使用node来执行该文件  
```
#!/usr/bin/env node

console.log('hello,node cli!')
```  
这样就可以在当前项目执行bin中的ech指令了
```
$ ech
hello,node cli!
```  
## 全局使用：npm link   
想要像全局安装vue-cli那样使用，只需要执行`npm link`就可以了
```
$ npm link

D:\appCache\nodejs\node_global\ech -> D:\appCache\nodejs\node_global\node_modules\ech-cli\bin\ech
D:\appCache\nodejs\node_global\node_modules\ech-cli -> D:\data\demo\node\ech-cli
```


## 丰富脚手架功能  
前面，我们实现了可全局执行ech命令，不过只是简单的打印了一个hello,node cli!，接下来就需要添加一些功能了  
先来想一想vue-cli的使用，就拿`vue create hello-world`举例。执行`vue create hello-world`后让我们选择一个预设，接着又是根据我们的选择提示一些对应的选择或输入，最后根据我们的操作生成对应的项目文件以及下载对应的模板和依赖。还有其他一些命令如`vue -h`提示一些用法，`vue -V`展示当前版本等等都是根据用户输入然后获取用户输入并做相应的反馈。  
同样的，我们只需要获取用户的输入，然后根据用户的输入做出相应的动作就行。有了思路，执行起来方便了。
- 使用commander定义一些命令以及用法提示  
- 根据用户的输入命令，判断是否有该命令，有则做出相应的反馈，没有则提示么有该命令。【可以使用chalk美化字符显示】  
- 使用inquirer与用户交互，获取用户的选择以及输入等
- 如果需要创建项目|下载模板，使用download-git-repo下载git里的模块到指定的目录，同时可以还使用ora做出loading效果

代码如下
```js ech
#!/usr/bin/env node
const path = require('path')
// 核心处理命令行
const program = require('commander')
// shell
const shell = require('shelljs')
//美化终端字符显示
const chalk = require('chalk')
//与用户交互
const inquirer = require('inquirer')
//loading模块
const ora = require('ora')
//下载git库
const download = require('download-git-repo')

// 模板文件
const template = 'direct:https://github.com/EchoHGX/express-demo.git'

const verStr = [
    `___________      .__`,     
    '\\_   _____/ ____ |  |__  ',
    ' |    __)__/ ___\\|  |  \\ ',
    ' |        \\  \\___|   Y  \\',
    '/_______  /\\___  >___|  /',
    '        \\/     \\/     \\/', 
    'ech cli of node',
    '',
    `version: ${chalk.green('0.0.1')}`
  ].join('\n')

program.version(verStr,'-V,--version')

// program.command('init','初始化项目')

const bindHandler = {
  init(){
    inquirer
      .prompt([
        {
          type: 'text',
          message: '请输入文件名称',
          name: 'dirname'
        },
        {
          type: 'list',
          message: '请选择对应的语言',
          choices: ['TypeScript',  ,'EcmaScript'],
          name: 'kind'
        }
      ])
      .then(res=>{
        // console.log('用户的反馈,',res)
        const dirname = res.dirname
        if(dirname){
          const loading = ora("下载初始化模板中...")
          loading.start()
          const _projectPath = path.join(process.cwd(),dirname)
          download(template,_projectPath,{clone: true},err=>{
            loading.stop()
            if(err){
              console.error(chalk.red('出错了'+err));
            }else{
              //将下载下来的模板的package名称替换掉
              shell.sed('-i','app',dirname,_projectPath + '/package.json')
              console.log(chalk.green('项目创建成功'))
            }
          })
        }
      })
  }
}

program
  .usage('[cmd] <options>')
  .arguments('<cmd> [env]')
  .action((cmd, params)=>{
    const handler = bindHandler[cmd] 
    if(typeof handler === 'undefined'){
      console.log(`${chalk.yellow('没有')}[${chalk.red(cmd)}]${chalk.yellow('命令')}`)
      process.exit(1)
    }else{
      handler(params)
    }
  })

program.parse(process.argv)
```  
以上添加了ech init来创建项目，这里只是简单随便的下载了一个git仓库，实际开发cli时可以按需求开发，例如添加webpack等


## 最后  
这样，一个简单的node脚手架就算完成了，还可以将包发布到npm【发布到npm的方法就在这啰嗦了】