
const appNetwork = process.env.REACT_APP_ETH_NETWORK
const releaseVersion = '2.0.0' // process.env.RELEASE_VERSION in the future

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && appNetwork === 'mainnet'

const isKovan = appNetwork === 'kovan'

export default {
  appNetwork,
  isKovan,
  isMainnetProd,
  releaseVersion
}
