const fs = require('fs')
const { Worker } = require('worker_threads');
const { resolve } = require('path')
const debug = require('debug')('pblog')
const pug = require('pug')
const markedWorker = new Worker(resolve(__dirname,'./markedWorker.js'));

// worker接收数量
let i = 0


// 默认配置对象
const defaultConfig = {
  title: 'p-blog博客框架',
  move: '黎明前的黑暗是最深不见底的黑暗',
  css: [],
  script: [],
  template: resolve(__dirname, './template')
}

// 合并配置
const mergeConfig = (defaultConfig, userConfig) => {
  const config = Object.assign(defaultConfig, userConfig)
  config.css.unshift('./theme/css/highlight.css')
  config.css.unshift('./theme/css/markdown.css')
  return config
}

// 移动文件夹以及内容
const moveDir = (src, dist) => {
  var copy=function(src,dst){
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function(path){
      var _src=src+'/'+path;
      var _dst=dst+'/'+path;
      fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
        if(err)throw err;
        if(stats.isFile()){ //如果是个文件则拷贝 
          let  readable=fs.createReadStream(_src);//创建读取流
          let  writable=fs.createWriteStream(_dst);//创建写入流
          readable.pipe(writable);
        }else if(stats.isDirectory()){ //是目录则 递归 
          checkDirectory(_src,_dst,copy);
        }
      });
    });
  }
  var checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
      if(err){
          fs.mkdirSync(dst);
          callback(src,dst);
      }else{
          callback(src,dst);
      }
    });
  };
  const SOURCES_DIRECTORY = resolve(__dirname, src) //源目录
  checkDirectory(SOURCES_DIRECTORY,resolve(__dirname, dist),copy);
}

// 删除文件夹下所有
function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()){
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

// 生成首页
const generateIndex = (list_doc, config) => {
  const compiledFunction = pug.compileFile(resolve(config.template, 'index.pug'));
  return compiledFunction({
    title: config.title,
    move: config.move,
    list_doc: list_doc,
    list_css: config.css,
    list_script: config.script
  })
}

module.exports = async function (userPath, isServer) {
  console.time()

  // 合并配置对象
  let userConfig = {}
  try {
    userConfig = require(resolve(userPath, 'pblog.config.js'))
  }catch {
    debug('没有配置文件，启用默认配置')
  }
  const config = mergeConfig(defaultConfig, userConfig)

  // 读取md文件目录下所有文章
  let listPostmd = []
  try {
    listPostmd = fs.readdirSync(resolve(userPath, 'post'), 'utf-8').filter(name => name.includes('.md')).map(name => name.replace(/\.md/, ''))
  }catch(e) {
    debug('抱歉，你需要在项目中新建一个post文件夹，并且写入第一篇你的文章hello.md！')
    throw new Error(e)
  }

  // 创建输出目录
  debug('清空dist')
  delDir(resolve(userPath, 'dist'))
  if (!fs.existsSync(resolve(userPath, 'dist'))) {
    debug('创建dist目录')
    fs.mkdirSync(resolve(userPath, 'dist'), 0755);
  }

  // 接收编译结果
  markedWorker.on('message', ({name, html}) => {
    let ws = fs.createWriteStream(resolve(userPath, `dist/${name}.html`), {
      flags: 'w', // 如果文件不存在，则创建；如果已经有内容，则先清空。
      encoding: 'utf8',
      highWaterMark: 4, // 预计每次写入的字节数;默认16k
      start: 0, // 起始写入的位置
      autoClose: true // 写完后关闭文件
    })
    ws.write(html, function(err) {
      debug('生成', `dist/${name}.html`)
      i++
      if(i === listPostmd.length) {
        moveDir(resolve(__dirname, `theme`), resolve(userPath, `dist/theme`))
        if (fs.existsSync(resolve(userPath, 'public'))) {
          moveDir(resolve(userPath, `public`), resolve(userPath, `dist`))
        }
        fs.writeFile(resolve(userPath, `dist/index.html`), generateIndex(listPostmd, config), 'utf-8', (err) => {
          debug('生成主页', `dist/index.html`)
          debug('完成')
          if(isServer) {
            require(resolve(__dirname,'./app.js'))(resolve(userPath, 'dist'))
          }
          console.timeEnd()
        })
        markedWorker.terminate();
      }
    });
    ws.end('')
  })

  // 创建文章上一篇下一篇链接
  const linkMap = {}
  if(listPostmd.length) {
    const linkList = [listPostmd[0], ...listPostmd, listPostmd[listPostmd.length-1]]
    for(let i = 1; i < linkList.length - 1; i++) {
      const key = linkList[i]
      linkMap[key] = {
        prev: linkList[i - 1],
        next: linkList[i + 1]
      }
    }
  }

  // 发送编译任务
  listPostmd.forEach(name => {
    debug('发送任务', name)
    markedWorker.postMessage({name, userPath, linkMap, config})
  })
  
}
