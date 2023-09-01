const config = require('./config')
const { logger } = require('./middleware/logger')
const app = require('./app')

app.listen(config.http.port, config.http.host)
logger.info(`Running on port: ${config.http.port}`)
