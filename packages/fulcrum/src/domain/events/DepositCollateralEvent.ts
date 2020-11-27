import { BigNumber } from '@0x/utils'
import { Asset } from '../Asset'

export class DepositCollateralEvent {
  public static readonly topic0: string =
    '0xa8a69faa6a38cc9c2beed79e034e1bd99f7eac877a5cee9f0118a8667b7ed93e'
  public readonly user: string //indexed
  public readonly depositToken: Asset //indexed
  public readonly loanId: string //indexed
  public readonly depositAmount: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    user: string,
    depositToken: Asset,
    loanId: string,
    depositAmount: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.user = user
    this.depositToken = depositToken
    this.loanId = loanId
    this.depositAmount = depositAmount
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}
