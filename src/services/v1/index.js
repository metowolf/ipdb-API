const Router = require('koa-router')
const qqwry = require('./qqwry/routes')
const ipip = require('./ipip/routes')

const v1 = new Router({
  prefix: '/v1',
})

v1.use(qqwry.routes())
v1.use(ipip.routes())

module.exports = v1
