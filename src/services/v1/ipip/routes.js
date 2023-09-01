const Router = require('koa-router')
const IPDB = require('ipdb')
const ipdb_range = require('@ipdb/range')
const ipdb_database = require('@ipdb/database')
const config = require('../../../config')
const ipdb = new IPDB(ipdb_database, {
  patches: [ipdb_range]
})

const router = new Router({
  prefix: '/ipip'
})

// version
router.get('/version', async (ctx) => {
  try {
    const result = {
      version: ipdb.meta
    }
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    ctx.throw(400, error.message)
  }
})

// find ip
router.get('/:ip', async (ctx) => {
  try {
    let ip = ctx.params.ip
    if (ip === 'me') {
      ip = ctx.headers[config.client_header] || ctx.ip
      ip = ip.split(',')[0]
    }
    const { code, data, message } = ipdb.find(ip)
    if (code) {
      throw new Error(message)
    }
    const result = {
      ip: data.ip,
      country_name: data.country_name,
      region_name: data.region_name,
      city_name: data.city_name,
      owner_domain: data.owner_domain || '',
      isp_domain: data.isp_domain || ''
    }
    if (!config.disable_range) {
      result.range = {
        from: data.range.from,
        to: data.range.to
      }
    }
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    ctx.throw(400, error.message)
  }
})

module.exports = router
