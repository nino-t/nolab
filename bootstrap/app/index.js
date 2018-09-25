const notifier = require('node-notifier')
const config = require('../../config')

if (process.env.NODE_ENV !== 'production') {
  const longjohn = require('longjohn')
  longjohn.empty_frame = 'ASYNC CALLBACK'
  longjohn.async_trace_limit = -1
}

require('pretty-error').start()

const path = require('path')

class Application {
  static get Express () {
    return require('express')
  }

  static get Cookie () {
    return require('cookie-parser')
  }

  static get Assets () {
    return require('serve-static')
  }

  static get CSRF () {
    return require('csurf')
  }

  static get MarkoExpress () {
    return require('marko/express')
  }

  boot () {
    if (typeof this.App === 'undefined') {
      this.App = Application.Express()
    }
  }

  static get Log () {
    return require('./logger')
  }

  static require (moduleName) {
    return require(moduleName)
  }

  use (...params) {
    this.boot()
    this.App.use(...params)
  }

  async start () {
    Application.Log.Application(`load config`)

    this.boot()
    this.use(Application.Cookie())
    this.use(Application.MarkoExpress())
    this.use(Application.CSRF({cookie: true}))

    if (config.APP_DEBUG) {
      this.use(Application.Log.request)
    }

    if (config.ASSET_ENABLED) {
      let dir = config.ASSET_DIR

      if (typeof dir === 'undefined' || dir === '') {
        dir = 'assets'
      }

      dir = dir.replace(/^\/+/, '')
      this.use(`/${dir}`, Application.Assets(path.resolve('../../', dir)))
    }

    this.App.listen(config.APP_PORT, () => {
      const msg = `${config.APP_NAME} listening on port ${config.APP_PORT}`
      Application.Log.Application(`${msg}`)
      Application.Log.Application(`host: ${config.APP_URL}`)
      Application.Log.Application(`env: ${config.APP_ENV}`)
      Application.Log.Application(`debug: ${config.APP_DEBUG}`)

      notifier.notify({
        title: config.APP_NAME,
        message: `${msg}`,
        icon: path.resolve(__dirname, 'icon.png'),
        open: config.APP_URL
      })
    })
  }
}

module.exports = Application
