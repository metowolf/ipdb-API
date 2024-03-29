const Router = require('koa-router')
const qqwry = require('./qqwry/routes')
const ipip = require('./ipip/routes')
const config = require('../../config')

const v1 = new Router({
  prefix: `${config.http.prefix}/v1`,
})

v1.use(qqwry.routes())
v1.use(ipip.routes())

module.exports = v1
