const morgan = require('morgan')
const chalk = require('chalk')
const _ = require('lodash')

class Log {
  static get request () {
    return morgan('tiny', { skip: Log._ignoreAssetsRequest })
  }

  static _ignoreAssetsRequest (req, res) {
    let url = req.url
    
    if (url.indexOf('?') > 0) {
      url = url.substr(0, url.indexOf('?'))
    }
      
    if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot)$/ig)) {
      return true
    }

    return false
  }

  static print (message, app, color) {
    app = app || 'nolab'
    color = color || 'cyan'

    if (_.isUndefined(message)) {
      return console.log()
    }

    console.log(chalk[color](`[${app}] ${message}`))
  }

  static objectType (object) {
    const objectType = _.isArray(object) ? 'Array' : 'Object'
    return `[Object ${objectType}]`
  }

  static parseObject (object, depth) {
    if (!_.isObject(object)) {
      return object
    }

    depth = depth || 0
    let text = depth === 0 ? `${Log.objectType(object)}\n` : ''

    Object.keys(object).forEach((key) => {
      if (typeof object[key] === 'object') {
        text += `${'  '.repeat(depth)}${key}: ${Log.objectType(object[key])}\n`
        text += Log.parseObject(object[key], depth + 1)
      } else {
        text += `${'  '.repeat(depth)}${key}: ${object[key]}\n`
      }
    })
    return text
  }

  static debug (...args) {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    if (args.length < 1) {
      return
    }
    
    let message = args[0]
    let name = 'debug'

    if (args.length > 1) {
      name = args[0]
      message = args[1]
    }

    message = Log.parseObject(message)
    
    console.log()
    console.log(chalk.bgRed(`${chalk.white(`[${name}]`)}`) + chalk.bgYellow(` ${chalk.black(message)} `))
    console.log()
  }

  static Nolab (message) {
    return Log.print(message, 'nolab', 'cyan')
  }
}

module.exports = Log
