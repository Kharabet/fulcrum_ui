import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'


export default class WithdrawCollateralEvent {
  public static readonly topic0: string =
    '0x7b1bab051266a4a36232da9b4341daf225fa42f7202b0e7207b9b502644ff1bb'
  public readonly user: string
  public readonly withdrawToken: Asset
  public readonly loanId: string
  public readonly withdrawAmount: BigNumber
  public readonly blockNumber: BigNumber
  public readonly txHash: string

  constructor(
    user: string,
    withdrawToken: Asset,
    loanId: string,
    withdrawAmount: BigNumber,
    blockNumber: BigNumber,
    txHash: string
  ) {
    this.user = user
    this.withdrawToken = withdrawToken
    this.loanId = loanId
    this.withdrawAmount = withdrawAmount
    this.blockNumber = blockNumber
    this.txHash = txHash
  }
}
