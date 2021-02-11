import { BigNumber } from '@0x/utils'

export interface IBorrowEstimate {
  borrowAmount: BigNumber
  gasEstimate: BigNumber
}
