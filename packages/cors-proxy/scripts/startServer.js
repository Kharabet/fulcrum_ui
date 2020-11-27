const server = require('../server')
const config = require('../config')

const proxyServer = server.createServer(config)

proxyServer.listen(config.port, config.host, () => {
  const {address, port} = proxyServer.address()
  console.log(`Running CORS Anywhere on ${address}:${port}`)
  if (config.originWhitelist.length > 0) {
    console.log(`Proxy origin whitelist: ${config.originWhitelist.join(', ')}`)
  }
})
