const notifier = require('node-notifier')

if (process.env.NODE_ENV !== 'production') {
  const longjohn = require('longjohn')
  longjohn.empty_frame = 'ASYNC CALLBACK'
  longjohn.async_trace_limit = -1
}

require('pretty-error').start()

const path = require('path')

class Nolab {
  static get Express () {
    return require('express')
  }

  static get Config () {
    return require('./config')
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
      this.App = Nolab.Express()
    }
  }

  static get Log () {
    return require('./logger')
  }

  static require (moduleName) {
    return require(moduleName)
  }

  static get appPath () {
    return path.resolve(__dirname, Nolab.Config.isDebug ? '../nolab' : '../../..')
  }

  use (...params) {
    this.boot()
    this.App.use(...params)
  }

  async start () {
    Nolab.Log.Nolab(`load config`)

    this.boot()
    this.use(Nolab.Cookie())
    this.use(Nolab.MarkoExpress())
    this.use(Nolab.CSRF({cookie: true}))

    if (Nolab.Config.isDev) {
      this.use(Nolab.Log.request)
    }

    if (Nolab.Config.Assets.enabled) {
      let dir = Nolab.Config.Assets.dir

      if (typeof dir === 'undefined' || dir === '') {
        dir = 'assets'
      }

      dir = dir.replace(/^\/+/, '')
      this.use(`/${dir}`, Nolab.Assets(path.resolve(Nolab.appPath, dir)))
    }

    this.App.listen(Nolab.Config.App.port, () => {
      const msg = `${Nolab.Config.App.name} listening on port ${Nolab.Config.App.port}`
      Nolab.Log.Nolab(`${msg}`)
      Nolab.Log.Nolab(`host: ${Nolab.Config.App.host}`)
      Nolab.Log.Nolab(`development: ${Nolab.Config.isDev}`)
      Nolab.Log.Nolab(`debug: ${Nolab.Config.isDebug}`)

      notifier.notify({
        title: 'Nolab',
        message: `${msg}${Nolab.Config.isDev ? `\nmode: development${Nolab.Config.isDebug ? ', debug' : ''}` : ''}`,
        icon: path.resolve(__dirname, 'icon.png'),
        open: Nolab.Config.App.host
      })
    })
  }
}

module.exports = Nolab
