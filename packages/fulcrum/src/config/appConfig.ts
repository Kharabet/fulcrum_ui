import Asset from 'bzx-common/src/assets/Asset'

const appNetwork = process.env.REACT_APP_ETH_NETWORK
const releaseVersion = '2.0.0' // process.env.RELEASE_VERSION in the future

const isMainnetProd =
  process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && appNetwork === 'mainnet'

const isKovan = appNetwork === 'kovan'

export const TRADE_PAIRS: Array<{ baseToken: Asset; quoteToken: Asset }> =
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'
    ? [
        { baseToken: Asset.ETH, quoteToken: Asset.DAI },
        { baseToken: Asset.ETH, quoteToken: Asset.USDC },
        { baseToken: Asset.ETH, quoteToken: Asset.USDT },
        { baseToken: Asset.ETH, quoteToken: Asset.WBTC },
        { baseToken: Asset.ETH, quoteToken: Asset.BZRX },
        { baseToken: Asset.DAI, quoteToken: Asset.USDC },
        { baseToken: Asset.DAI, quoteToken: Asset.USDT },
        { baseToken: Asset.WBTC, quoteToken: Asset.DAI },
        { baseToken: Asset.WBTC, quoteToken: Asset.USDC },
        { baseToken: Asset.WBTC, quoteToken: Asset.USDT },
        { baseToken: Asset.WBTC, quoteToken: Asset.BZRX },
        { baseToken: Asset.BZRX, quoteToken: Asset.DAI },
        { baseToken: Asset.BZRX, quoteToken: Asset.USDC },
        { baseToken: Asset.BZRX, quoteToken: Asset.USDT },
        { baseToken: Asset.LINK, quoteToken: Asset.DAI },
        { baseToken: Asset.LINK, quoteToken: Asset.USDC },
        { baseToken: Asset.LINK, quoteToken: Asset.USDT },
        { baseToken: Asset.LINK, quoteToken: Asset.BZRX },
        { baseToken: Asset.MKR, quoteToken: Asset.DAI },
        { baseToken: Asset.MKR, quoteToken: Asset.USDC },
        { baseToken: Asset.MKR, quoteToken: Asset.USDT },
        { baseToken: Asset.MKR, quoteToken: Asset.BZRX },
        { baseToken: Asset.YFI, quoteToken: Asset.DAI },
        { baseToken: Asset.YFI, quoteToken: Asset.USDC },
        { baseToken: Asset.YFI, quoteToken: Asset.USDT },
        { baseToken: Asset.YFI, quoteToken: Asset.BZRX },
        { baseToken: Asset.KNC, quoteToken: Asset.DAI },
        { baseToken: Asset.KNC, quoteToken: Asset.USDC },
        { baseToken: Asset.KNC, quoteToken: Asset.USDT },
        { baseToken: Asset.KNC, quoteToken: Asset.BZRX },
        { baseToken: Asset.UNI, quoteToken: Asset.DAI },
        { baseToken: Asset.UNI, quoteToken: Asset.USDC },
        { baseToken: Asset.UNI, quoteToken: Asset.USDT },
        { baseToken: Asset.UNI, quoteToken: Asset.BZRX },
        { baseToken: Asset.AAVE, quoteToken: Asset.DAI },
        { baseToken: Asset.AAVE, quoteToken: Asset.USDC },
        { baseToken: Asset.AAVE, quoteToken: Asset.USDT },
        { baseToken: Asset.AAVE, quoteToken: Asset.BZRX },
        { baseToken: Asset.LRC, quoteToken: Asset.DAI },
        { baseToken: Asset.LRC, quoteToken: Asset.USDC },
        { baseToken: Asset.LRC, quoteToken: Asset.USDT },
        { baseToken: Asset.LRC, quoteToken: Asset.BZRX },
        { baseToken: Asset.COMP, quoteToken: Asset.DAI },
        { baseToken: Asset.COMP, quoteToken: Asset.USDC },
        { baseToken: Asset.COMP, quoteToken: Asset.USDT },
        { baseToken: Asset.COMP, quoteToken: Asset.BZRX }
      ]
    : process.env.REACT_APP_ETH_NETWORK === 'bsc'
    ? [
        { baseToken: Asset.BNB, quoteToken: Asset.BUSD },
        { baseToken: Asset.BNB, quoteToken: Asset.USDT },
        { baseToken: Asset.ETH, quoteToken: Asset.BUSD },
        { baseToken: Asset.ETH, quoteToken: Asset.USDT },
        { baseToken: Asset.BTC, quoteToken: Asset.BUSD },
        { baseToken: Asset.BTC, quoteToken: Asset.USDT },
        { baseToken: Asset.BUSD, quoteToken: Asset.USDT },
      ]
    : []

export default {
  appNetwork,
  isKovan,
  isMainnetProd,
  releaseVersion,
  TRADE_PAIRS
}
