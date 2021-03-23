import { BigNumber } from '@0x/utils'
import Asset from '../../assets/Asset'
import { TorqueProvider } from '../../../../torque/src/services/TorqueProvider'
import { ExplorerProvider } from '../../../../protocol-explorer/src/services/ExplorerProvider'
import { FulcrumProvider } from '../../../../fulcrum/src/services/FulcrumProvider'

const API_URL = 'https://api.bzx.network'

const getSwapToUsdRateOffChain = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider,
  asset: Asset
): Promise<BigNumber> => {
  let result = new BigNumber(0)
  const token = provider.isETHAsset(asset) ? Asset.ETH : asset
  const swapToUsdHistoryRateRequest = await fetch(`${API_URL}/v1/oracle-rates-usd`)
  const swapToUsdHistoryRateResponse = await swapToUsdHistoryRateRequest.json()
  if (
    swapToUsdHistoryRateResponse.success &&
    swapToUsdHistoryRateResponse.data[token.toLowerCase()]
  ) {
    result = new BigNumber(swapToUsdHistoryRateResponse.data[token.toLowerCase()])
  }
  return result
}

const getSwapToUsdRatesOffChain = async (
  provider: FulcrumProvider | TorqueProvider | ExplorerProvider,
  assets: Asset[]
): Promise<BigNumber[]> => {
  let result = Array<BigNumber>(assets.length).fill(new BigNumber(0))
  const swapToUsdHistoryRateRequest = await fetch(`${API_URL}/v1/oracle-rates-usd`)
  const swapToUsdHistoryRateResponse = await swapToUsdHistoryRateRequest.json()
  if (swapToUsdHistoryRateResponse.success) {
    result = assets.map((asset) => {
      const token = provider.isETHAsset(asset) ? Asset.ETH : asset
      return swapToUsdHistoryRateResponse.data[token.toLowerCase()]
        ? new BigNumber(swapToUsdHistoryRateResponse.data[token.toLowerCase()])
        : new BigNumber(0)
    })
  }
  return result
}

export default { getSwapToUsdRateOffChain, getSwapToUsdRatesOffChain }
