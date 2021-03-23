import { BigNumber } from '@0x/utils'
import Asset from '../../assets/Asset'
import AssetsDictionary from '../../assets/AssetsDictionary'
import providerUtils from '../providerUtils'
import opacleApi from './oracleApi'
import { TorqueProvider } from '../../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../../protocol-explorer/src/services/ExplorerProvider'
import { StakingProvider } from '../../../../staking-dashboard/src/services/StakingProvider'
import { FulcrumProvider } from '../../../../fulcrum/src/services/FulcrumProvider'

const networkName = process.env.REACT_APP_ETH_NETWORK
const API_URL = 'https://api.kyber.network'

// Returns swap rate from Kyber
async function getKyberSwapRate(
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider | StakingProvider,
  srcAsset: Asset,
  destAsset: Asset,
  srcAmount?: BigNumber
): Promise<BigNumber> {
  if (networkName !== 'mainnet') {
    // Kyebr doesn't support our kovan tokens so the price for them is taken from our PriceFeed contract
    return opacleApi.getSwapRate(provider, srcAsset, destAsset)
  }
  let result: BigNumber = new BigNumber(0)
  const srcAssetErc20Address = providerUtils.getErc20AddressOfAsset(srcAsset)
  const destAssetErc20Address = providerUtils.getErc20AddressOfAsset(destAsset)

  if (srcAssetErc20Address && destAssetErc20Address) {
    const srcAssetDecimals = AssetsDictionary.assets.get(srcAsset)?.decimals || 18
    if (!srcAmount) {
      srcAmount = providerUtils.getGoodSourceAmountOfAsset(srcAsset)
    } else {
      srcAmount = new BigNumber(srcAmount.toFixed(1, 1))
    }
    try {
      const oneEthWorthTokenAmount = await fetch(
        `${API_URL}/buy_rate?id=${srcAssetErc20Address}&qty=1`
      )
        .then((resp) => resp.json())
        .then((resp) => 1 / resp.data[0].src_qty[0])
        .catch(console.error)
      if (oneEthWorthTokenAmount) {
        srcAmount = new BigNumber(oneEthWorthTokenAmount)
          .times(10 ** srcAssetDecimals)
          .dp(0, BigNumber.ROUND_HALF_UP)
      }

      const swapPriceData = await fetch(
        `${API_URL}/expectedRate?source=${srcAssetErc20Address}&dest=${destAssetErc20Address}&sourceAmount=${srcAmount}`
      )
        .then((resp) => resp.json())
        .catch(console.error)

      result = new BigNumber(swapPriceData['expectedRate']).dividedBy(10 ** 18)
    } catch (e) {
      console.error(e)
      result = new BigNumber(0)
    }
  }
  return result
}

export { getKyberSwapRate }
