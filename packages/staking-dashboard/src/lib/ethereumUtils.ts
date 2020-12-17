type networks = 'mainnet' | 'ropsten' | 'rinkeby' | 'kovan'

enum networkIds {
  mainnet = 1,
  ropsten = 3,
  rinkeby = 4,
  kovan = 42
}

function getNetworkIdByString(networkName: networks | undefined): 1 | 3 | 4 | 42 | 0 {
  if (!networkName || !networkIds[networkName]) {
    return 0
  }
  return networkIds[networkName]
}

export default {
  getNetworkIdByString
}
