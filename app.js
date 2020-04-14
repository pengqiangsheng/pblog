const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('pblog')
const opn = require('opn')
const logger = require('koa-logger')
const serve = require('koa-static')
const port = process.env.PORT || 80
const host = process.env.HOST || ''

module.exports = function(path) {
  app.use(logger())
  app.use(serve(path, { maxage: 0 }))

  app.listen(port, host, () => {
    debug(`本地预览服务器已经启动: 点击访问 http://${host ? host : 'localhost'}:${port}`)
    debug(`自动打开浏览器中...`)
    opn(`http://${host ? host : 'localhost'}:${port}`).then(() => {
      debug(`已自动打开默认浏览器`)
    })
  })
}