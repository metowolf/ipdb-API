const cors = require('koa2-cors')
const helmet = require('koa-helmet')
const Koa = require('koa')
const { requestLogger } = require('./middleware/logger')
const { responseTime, errors } = require('./middleware')
const { v1 } = require('./services')

const app = new Koa()

// disable console.errors for pino
app.silent = true

// Error handler
app.use(errors)

// HTTP header security
app.use(helmet())

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'Accept'],
  exposeHeaders: ['x-api-response-time']
}))

// Set header with API response time
app.use(responseTime)

// Request logging
app.use(requestLogger)

// V1 routes
app.use(v1.routes())

module.exports = app
