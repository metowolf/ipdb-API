const koaPino = require('koa-pino-logger')
const pino = require('pino')

module.exports.requestLogger = koaPino()
module.exports.logger = pino()
