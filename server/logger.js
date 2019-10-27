const pino = require('pino')

const dev = process.env.NODE_ENV !== 'production'
let level = (dev) ? 'debug' : 'error'

if (process.env.DEBUG) {
    level = 'debug'
}

const options = {
    level,
    prettyPrint: dev
}
if (dev) {
    options.base = null
}

module.exports = pino(options)