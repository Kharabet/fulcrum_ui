import { BigNumber } from '@0x/utils'
import { Asset } from './Asset'
import moment from 'moment'

export class ExtendLoanRequest {
  public id: number
  public borrowAsset: Asset
  public accountAddress: string
  public loanId: string
  public depositAmount: BigNumber

  constructor(
    borrowAsset: Asset,
    accountAddress: string,
    loanId: string,
    depositAmount: BigNumber
  ) {
    this.id = moment().unix() + Math.floor(Math.random() * 10)
    this.borrowAsset = borrowAsset
    this.accountAddress = accountAddress
    this.loanId = loanId
    this.depositAmount = depositAmount
  }
}
