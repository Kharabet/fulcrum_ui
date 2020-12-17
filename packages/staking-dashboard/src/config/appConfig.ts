import ethereumUtils from 'app-lib/ethereumUtils'

const appNetwork = process.env.REACT_APP_ETH_NETWORK

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && appNetwork === 'mainnet'

const isKovan = appNetwork === 'kovan'

/**
 * mainnet: 1, ropsten: 3, rinkeby: 4, kovan: 42, default (local): 0
 */
const appNetworkId = ethereumUtils.getNetworkIdByString(appNetwork)

/**
 * BPT is not the same token in prod or Kovan
 */
const bptDecimals = isKovan ? 10 ** 6 : 10 ** 18

export default {
  appNetwork,
  appNetworkId,
  bptDecimals,
  isKovan,
  isMainnetProd
}
