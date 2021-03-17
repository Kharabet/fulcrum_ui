import { BigNumber } from '@0x/utils'
import Asset from '../assets/Asset'
import ethereumUtils from '../lib/ethereumUtils'
import networksTradePairs from './networksTradePairs'

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

const tokenForUsdSwapRate = isMainnet ? Asset.DAI : isBsc ? Asset.BUSD : Asset.USDC

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

export const tradePairs = isMainnet
  ? networksTradePairs.mainnetPairs
  : isBsc
  ? networksTradePairs.bscPairs
  : []

export default {
  appNetwork,
  appNetworkId,
  bptDecimals,
  infiniteApproval,
  isBsc,
  isGTMEnabled,
  isKovan,
  isMainnet,
  isProduction,
  releaseVersion,
  tokenForUsdSwapRate,
  tradePairs,
  vestingDurationAfterCliff,
  web3ProviderSettings,
}
