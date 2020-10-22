import { BigNumber } from '@0x/utils'

export interface ICollateralChangeEstimate {
  collateralAmount: BigNumber
  collateralizedPercent: BigNumber
  liquidationPrice: BigNumber
  gasEstimate: BigNumber
  isWithdrawal: boolean
}
