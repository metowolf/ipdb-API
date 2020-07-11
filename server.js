const config = require('./src/config')
const { logger } = require('./src/middleware/logger')
const app = require('./src/app')

app.listen(config.http.port, config.http.host)
logger.info(`Running on port: ${config.http.port}`)
