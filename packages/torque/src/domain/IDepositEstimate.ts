import { BigNumber } from '@0x/utils'

export interface IDepositEstimate {
  depositAmount: BigNumber
  gasEstimate: BigNumber
}
