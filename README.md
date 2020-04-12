# pblog

> 它是什么？pblog是一个静态博客生成器，源于作者的一时突发奇想。

## 使用

怎么使用？

> 你需要全局安装`p-blog`

## 安装

```shell
yarn global add p-blog
or
npm install p-blog -g
```

## 命令

- 1.pblog 生成博客
- 2.pblog -s 生成博客后启动本地web服务预览（端口默认80，没做冲突兼容）

## `pblog`命令的背后

哦，也许你想进一步了解它做了什么？

当你输入`pblog`，进行回车之后

- 首先它会读取你当前项目根目录下的`post`文件夹下所有md格式的文章
- 之后进行模板渲染
- 最后输出html文件

> 哇，是不是很简单，so easy!


## 配置文件 `pblog.config.js`

> 有时候，你可能需要自定义一些选项，比如网站的标题，还有一些样式或者脚本等等，它就显得必要了。

你需要在项目根目录下新建一个`pblog.config.js`文件，然后使用CommonJs规范导出一个对象。

```js
module.exports = {
  title: '彭小呆的博客',
  move: '黎明前的黑暗是最深不见底的黑暗',
  css: [],
  script: [],
}
// title: 网页标题
// move: 主页显示的一句话
// css/script: 可放相对于public目录下的文件或者是外链的一个数组，比如你有这样的一个文件：public/css/my.css， 那你应该写成'./css/my.css'
// template: 自定义模板的文件夹绝对路径（首页名称为index.pug, 文章页面模板名称为post.pug）
```

目前有6大字段可以配置哦！

- title
- logo
- move
- css
- script
- template

!> 特别注意：如果你没有想改动主题的话，请不要配置`template`字段，因为它可能导致一些意外。


## 自定义模板

> 哦，也许你认为我的主题太过于简约了，但是大道至简。

从此刻起你需要配置`template`字段

提供一个放置模板文件的文件夹路径（物理绝对路径）

比如：你写好了`index.pug`和`post.pug`两个模板，放在了项目的根目录下的`custom-tamplate`文件夹下，那么要怎么配置这个字段呢？

```js
const { resolve } = require('fs')
module.exports = {
  // 省略其他字段
  template: resolve(__dirname, `custom-tamplate`)
}
```

对，你就要这样配置咯，不管你用什么方法，总之，你要让这个`template`字段的值是这样的：

`D:/项目目录/custom-tamplate`

对的，物理绝对路径！！


## 自定义主题

> 主题相对于比较简单，覆盖最后输出目录`dist/theme/css`下的3个文件即可。

- reset.css
- highlight.css
- markdown.css

覆盖，保持原有的名字，is ok？