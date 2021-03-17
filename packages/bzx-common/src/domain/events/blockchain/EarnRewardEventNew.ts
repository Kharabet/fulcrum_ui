import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export default class EarnRewardEventNew {
  public static readonly topic0: string =
    '0xe6c5d7a78caa3f3f24c92ef7f180efb19eb4cc6decff0d5b9cbc4d164b718d09'
  public readonly reciever: string //indexed
  public readonly loanId: string //indexed
  public readonly feeType: FeeType //indexed
  public readonly token: Asset
  public readonly amount: BigNumber
  public readonly blockNumber: BigNumber
  public readonly txHash: string

  constructor(
    reciever: string,
    loanId: string,
    feeType: number,
    token: Asset,
    amount: BigNumber,
    blockNumber: BigNumber,
    txHash: string
  ) {
    this.reciever = reciever
    this.token = token
    this.loanId = loanId
    this.feeType = feeType
    this.amount = amount
    this.blockNumber = blockNumber
    this.txHash = txHash
  }
}

export enum FeeType {
  Lending,
  Trading,
  Borrowing,
  SettleInterest,
}
