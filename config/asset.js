require('dotenv').config()
const app = require('./app')
const moment = require('moment')

const ASSET_ENABLED   = process.env.ASSET_ENABLED || true
const ASSET_ROUTE     = process.env.ASSET_ROUTE || '/public'
const ASSET_DIR       = process.env.ASSET_DIR || 'public'
const ASSET_URL       = `${app.APP_URL}/${ASSET_ROUTE.replace(/^\/+/, '')}`
const ASSET_VERSION   = moment().format('X')

module.exports = {
  ASSET_ENABLED,
  ASSET_ROUTE,
  ASSET_DIR,
  ASSET_URL,
  ASSET_VERSION
}