require('dotenv').config()

const APP_NAME      = process.env.APP_NAME || 'Nolab'
const APP_ENV       = process.env.APP_ENV || 'development'
const APP_DEBUG     = process.env.APP_DEBUG || true
const APP_PORT      = process.env.APP_PORT || 3000
const APP_URL       = process.env.APP_URL || `http://localhost:${APP_PORT}`
const APP_TIMEZONE  = process.env.APP_TIMEZONE || 'UTC' 

module.exports = {
  APP_NAME,
  APP_ENV,
  APP_DEBUG,
  APP_URL,
  APP_PORT,
  APP_TIMEZONE
}