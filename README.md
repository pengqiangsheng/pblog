# pblog

> 它是什么？pblog是一个静态博客生成器，源于作者的一时突发奇想。

## 使用

怎么使用？

> 你需要全局安装`pblog`

## 安装

```shell
yarn global add pblog
or
npm install pblog -g
```

## 命令

- 1.pblog 生成博客
- 2.pblog -s 生成博客后启动本地web服务预览（端口默认80，没做冲突兼容）

## `pblog`命令的背后

哦，也许你想进一步了解它做了什么？

当你输入`pblog`，进行回车之后

- 首先它会读取你当前项目下的`post`文件夹下所有md格式的文章
- 之后进行模板渲染
- 最后输出html文件

> 哇，是不是很简单，so easy!