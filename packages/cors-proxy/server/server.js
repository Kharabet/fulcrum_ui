'use strict'
const corsAnywhere = require('cors-anywhere')

/**
 * @param {{originWhitelist: string[]}} config
 */
function createServer (config) {
  return corsAnywhere.createServer({
    originWhitelist: config.originWhitelist,
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: [
      'cookie',
      'cookie2',
      // Strip Heroku-specific headers
      'x-heroku-queue-wait-time',
      'x-heroku-queue-depth',
      'x-heroku-dynos-in-use',
      'x-request-start',
    ],
    redirectSameOrigin: true,
    httpProxyOptions: {
      // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
      xfwd: false,
    },
  })
}

module.exports = {
  createServer
}
