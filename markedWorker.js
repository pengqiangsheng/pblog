const marked = require('marked');
const hljs = require('highlight.js');
const { parentPort } = require('worker_threads');
const fs = require('fs')
const { resolve } = require('path')
const minify = require('html-minifier').minify;
marked.setOptions({
  highlight: function(code, lang, callback) {
    const highlightedCode = hljs.highlightAuto(code).value
    return highlightedCode
  }
});
const pug = require('pug');

parentPort.on('message', ({name, userPath, linkMap, config}) => {
  const compiledFunction = pug.compileFile(resolve(config.template, 'post.pug'));
  // debug('读取pug模板完成')
  const markdownString = fs.readFileSync(resolve(userPath, 'post',`${name}.md`), 'utf-8')
  // debug('读取md文件:', `${name}.md`)
  const html = compiledFunction({
    link: linkMap[name],
    title: config.title + '-' +name,
    html: marked(markdownString),
    list_css: config.css,
    list_script: config.script,
    list_doc: config.listPostmd
  })
  // debug('转换pug模板为html完成')
  const minifyHtml =  minify(html, {removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true})
  // debug('压缩html代码完成')
  parentPort.postMessage({name, html: minifyHtml});
});