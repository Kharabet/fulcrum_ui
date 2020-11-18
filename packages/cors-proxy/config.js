const dotenv = require('dotenv')
dotenv.config()

/**
  * @type {string[]} list of hosts
  */
let originWhitelist = []

try {
  originWhitelist = JSON.parse(process.env.ORIGIN_WHITE_LIST)
  if (!Array.isArray(originWhitelist)) {
    throw new Error('Expected an array of hosts for ORIGIN_WHITE_LIST')
  }
}
catch (err) {
  console.log('[config] No valid origin white list found. Anyone can use the proxy.')
}

module.exports = {
  originWhitelist,
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0',
}
