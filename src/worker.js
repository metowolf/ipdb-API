import { Hono } from 'hono'
import Parse from './parse.js'
import ipdb_range from './range.js'
import { Buffer } from 'node:buffer'

const app = new Hono()

const DATABASE_PATH = {
  ipip: 'ipipfree.ipdb',
  qqwry: 'qqwry.ipdb',
  openipdb: 'openipdb.ipdb'
}

const getInstance = async (c) => {
  const { database } = c.req.param()
  const path = DATABASE_PATH[database]
  if (!path) {
    throw new Error('Invalid database')
  }

  const object = await c.env.OPENIPDB_BUCKET.get(path)
  if (!object) {
    throw new Error('Database not found')
  }

  const arraybuffer = await object.arrayBuffer()
  const buffer = Buffer.from(arraybuffer)

  return new Parse(buffer, {
    patches: [ipdb_range]
  })
}

app.get('/ip/v1/:database/version', async (c) => {
  const ipdb = await getInstance(c)
  
  const version = ipdb.meta

  return c.json({ version })
})

app.get('/ip/v1/:database/:ip', async (c) => {
  const ipdb = await getInstance(c)

  let { ip } = c.req.param()
  if (ip === 'me') {
    ip = c.req.header('cf-connecting-ip') || c.req.ip
    ip = ip.split(',')[0]
  }
  const { code, data } = ipdb.find(ip)
  if (code) {
    throw new Error('Invalid IP address')
  }

  return c.json({
    ip: data.ip,
    country_name: data.country_name || data.country || '',
    region_name: data.region_name || data.province || data.region || '',
    city_name: data.city_name || data.city || '',
    owner_domain: data.owner_domain || data.owner || '',
    isp_domain: data.isp_domain || data.isp || '',
    range: {
      from: data.range.from,
      to: data.range.to
    }
  })
})

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 400)
})

export default app