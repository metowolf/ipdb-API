import { serve } from '@hono/node-server'
import app from './worker.js'
import startLocalBucket from './bucket.js'

const config = {
  port: parseInt(process.env.HTTP_PORT || '3000'),
  path: process.env.BUCKET_PATH || '/tmp/openipdb'
}

const start = async () => {
  const bucket = await startLocalBucket(config.path)
  serve({
    fetch: (request, env, ...args) => {
      env.OPENIPDB_BUCKET = bucket
      return app.fetch(request, env, ...args)
    },
    port: parseInt(config.port || '3000')
  })
}

start()