require('marko/node-require')
const bootstrap = require('./bootstrap/default')
const app = new bootstrap()

app.start()