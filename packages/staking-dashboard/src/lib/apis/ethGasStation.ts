import { BigNumber } from '@0x/utils'

const API_URL = 'https://ethgasstation.info/json/ethgasAPI.json'

/**
 * Get the current gas price from https://ethgasstation.info/
 */
async function getGasPrice() {
  let result = new BigNumber(500).multipliedBy(10 ** 9)
  const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9)

  try {
    const response = await fetch(API_URL)
    const jsonData = await response.json()
    if (jsonData.average) {
      // ethgasstation values need divide by 10 to get gwei
      const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10 ** 8)
      const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10 ** 8)
      if (gasPriceAvg.lt(result)) {
        result = gasPriceAvg
      } else if (gasPriceSafeLow.lt(result)) {
        result = gasPriceSafeLow
      }
    }
  } catch (error) {
    result = new BigNumber(60).multipliedBy(10 ** 9) // error default 60 gwei
  }

  if (result.lt(lowerLimit)) {
    result = lowerLimit
  }

  return result
}

export default {
  getGasPrice
}
