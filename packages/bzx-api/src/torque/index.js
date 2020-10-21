import { iTokens } from '../config/iTokens'

import BigNumber from 'bignumber.js'
import { iTokenJson } from '../contracts/iTokenContract'

export default class Torque {
  constructor(web3, storage, logger) {
    this.web3 = web3
    this.storage = storage
    this.logger = logger
  }

  async getBorrowDepositEstimate(borrowAssetName, collateralAssetName, amount) {
    const cachedResult = await this.storage.getItem(
      `borrow-deposit-estimate-${borrowAssetName}_${collateralAssetName}_${amount}`
    )
    if (cachedResult) {
      return cachedResult
    }
    console.log('no cache')
    const result = { depositAmount: new BigNumber(0), gasEstimate: new BigNumber(0) }
    const borrowAsset = iTokens.find((token) => token.name === borrowAssetName)
    const collateralAsset = iTokens.find((token) => token.name === collateralAssetName)

    const iTokenContract = new this.web3.eth.Contract(iTokenJson.abi, borrowAsset.address)
    const collateralAssetErc20Address = collateralAsset.erc20Address
    if (iTokenContract && collateralAssetErc20Address) {
      const loanPrecision = borrowAsset.decimals || 18
      const collateralPrecision = collateralAsset.decimals || 18
      this.logger.info('call iTokenContract for Torque')

      const borrowEstimate = await iTokenContract.methods
        .getDepositAmountForBorrow(
          new BigNumber(amount).multipliedBy(10 ** loanPrecision),
          new BigNumber(7884000), // approximately 3 months
          collateralAssetErc20Address
        )
        .call()
      result.depositAmount = new BigNumber(borrowEstimate)
        .dividedBy(10 ** collateralPrecision)
        .multipliedBy(1.2)
    }
    await this.storage.setItem(
      `borrow-deposit-estimate-${borrowAssetName}_${collateralAssetName}_${amount}`,
      result,
      { ttl: 1000 * 60 * 5 /* 5 mins */ }
    )

    return result
  }
}
