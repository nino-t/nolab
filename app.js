require('marko/node-require')
const bootstrap = require('./bootstrap/app')
const app = new bootstrap()

app.start()