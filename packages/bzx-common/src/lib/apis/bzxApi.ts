import { BigNumber } from '@0x/utils'
import Asset from '../../assets/Asset'
import providerUtils from '../providerUtils'

const API_URL = 'https://api.bzx.network'

const getSwapToUsdRateOffChain = async (asset: Asset): Promise<BigNumber> => {
  let result = new BigNumber(0)
  const token = providerUtils.isNativeToken(asset) ? Asset.ETH : asset
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

const getSwapToUsdRatesOffChain = async (assets: Asset[]): Promise<BigNumber[]> => {
  let result = Array<BigNumber>(assets.length).fill(new BigNumber(0))
  const swapToUsdHistoryRateRequest = await fetch(`${API_URL}/v1/oracle-rates-usd`)
  const swapToUsdHistoryRateResponse = await swapToUsdHistoryRateRequest.json()
  if (swapToUsdHistoryRateResponse.success) {
    result = assets.map((asset) => {
      const token = providerUtils.isNativeToken(asset) ? Asset.ETH : asset
      return swapToUsdHistoryRateResponse.data[token.toLowerCase()]
        ? new BigNumber(swapToUsdHistoryRateResponse.data[token.toLowerCase()])
        : new BigNumber(0)
    })
  }
  return result
}

export default { getSwapToUsdRateOffChain, getSwapToUsdRatesOffChain }
