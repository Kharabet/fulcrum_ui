
const appNetwork = process.env.REACT_APP_ETH_NETWORK
const releaseCommit = process.env.REACT_APP_GIT_SHA

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && appNetwork === 'mainnet'

const isKovan = appNetwork === 'kovan'

export default {
  appNetwork,
  isKovan,
  isMainnetProd,
  releaseCommit
}
