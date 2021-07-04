require('dotenv-flow').config()

module.exports = {
  http: {
    port: parseInt(process.env.HTTP_PORT || 3000, 10),
    host: process.env.HTTP_HOST || 'localhost',
    prefix: process.env.HTTP_PREFIX || ''
  }
}
