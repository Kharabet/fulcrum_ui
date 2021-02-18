import { BigNumber } from '@0x/utils'
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

const web3ProviderSettings = ethereumUtils.getWeb3ProviderSettings(appNetworkId)

const infiniteApproval = new BigNumber(10 * 10 ** 50)

/**
 * Amount of time that needs to have passed for all vbzrx to have vested (after cliff)
 * @see https://github.com/bZxNetwork/contractsV2/blob/2ee66ab40eff103441cad040452f6ed06f197520/contracts/staking/StakingConstants.sol#L33
 */
const vestingDurationAfterCliff = 110376000

export default {
  appNetwork,
  appNetworkId,
  bptDecimals,
  infiniteApproval,
  isKovan,
  isMainnetProd,
  vestingDurationAfterCliff,
  web3ProviderSettings
}
