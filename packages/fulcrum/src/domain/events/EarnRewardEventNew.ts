import { BigNumber } from '@0x/utils'
import { Asset } from '../Asset'

export class EarnRewardEventNew {
  public static readonly topic0: string =
    '0xe6c5d7a78caa3f3f24c92ef7f180efb19eb4cc6decff0d5b9cbc4d164b718d09'
  public readonly reciever: string //indexed
  public readonly loanId: string //indexed
  public readonly feeType: FeeType //indexed
  public readonly token: Asset 
  public amount: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    reciever: string,
    loanId: string,
    feeType: number,
    token: Asset,
    amount: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.reciever = reciever
    this.token = token
    this.loanId = loanId
    this.feeType = feeType
    this.amount = amount
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}

export enum FeeType {
    Lending,
    Trading,
    Borrowing,
    SettleInterest
}
