const moment = require('moment')
const _ = require('lodash')

function required (key) {
  return `ERR_REQUIRED#${key}`
}

const defaultConfig = {
  App: {
    name: 'nolab',
    port: 3000,
    host: ($) => `http://localhost:${$.App.port}`
  },
  Assets: {
    enabled: true,
    route: '/public',
    dir: 'public',
    url: ($) => `${$.App.host}/${$.Assets.route.replace(/^\/+/, '')}`,
    version: moment().format('X')
  },
  isDebug: process.env.NOLAB_ENV === 'development',
  isDev: ['production', 'staging'].indexOf(process.env.NODE_ENV) < 0
}

module.exports = defaultConfig
