import { BigNumber } from '@0x/utils'
import Asset from '../assets/Asset'
import ethereumUtils from '../lib/ethereumUtils'

const appNetwork = process.env.REACT_APP_ETH_NETWORK as
  | 'mainnet'
  | 'ropsten'
  | 'rinkeby'
  | 'kovan'
  | 'bsc'
  | undefined

const isGTMEnabled = process.env.NODE_ENV && process.env.NODE_ENV === 'production'
const releaseVersion = '2.0.0' // process.env.RELEASE_VERSION in the future

const isProduction = process.env.NODE_ENV && process.env.NODE_ENV === 'production'

const isKovan = appNetwork === 'kovan'

const isBsc = appNetwork === 'bsc'

const isMainnet = appNetwork === 'mainnet'

/**
 * mainnet: 1, ropsten: 3, rinkeby: 4, kovan: 42, default (local): 0
 */
const appNetworkId = ethereumUtils.getNetworkIdByString(appNetwork)

/**
 * BPT is not the same token in prod or Kovan
 */
const bptDecimals = isKovan ? 10 ** 6 : 10 ** 18

const web3ProviderSettings = ethereumUtils.getWeb3ProviderSettings(appNetworkId)

const infiniteApproval = new BigNumber(10 * 10 ** 50)

/**
 * Amount of time that needs to have passed for all vbzrx to have vested (after cliff)
 * @see https://github.com/bZxNetwork/contractsV2/blob/2ee66ab40eff103441cad040452f6ed06f197520/contracts/staking/StakingConstants.sol#L33
 */
const vestingDurationAfterCliff = 110376000

export const TRADE_PAIRS: Array<{ baseToken: Asset; quoteToken: Asset }> = isMainnet
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
      { baseToken: Asset.COMP, quoteToken: Asset.BZRX },
    ]
  : isBsc
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
  appNetworkId,
  bptDecimals,
  infiniteApproval,
  isKovan,
  isBsc,
  isMainnet,
  isGTMEnabled,
  isProduction,
  vestingDurationAfterCliff,
  web3ProviderSettings,
  releaseVersion,
  TRADE_PAIRS,
}
