import { BigNumber } from '@0x/utils'
import { Asset } from './Asset'
import moment from 'moment'

export class RepayLoanRequest {
  public id: number
  public borrowAsset: Asset
  public collateralAsset: Asset
  public accountAddress: string
  public loanId: string
  public repayAmount: BigNumber
  public repayPercent: BigNumber
  public amountOwed: BigNumber

  constructor(
    borrowAsset: Asset,
    collateralAsset: Asset,
    accountAddress: string,
    loanId: string,
    repayAmount: BigNumber,
    repayPercent: BigNumber,
    amountOwed: BigNumber
  ) {
    this.id = moment().unix() + Math.floor(Math.random() * 10)
    this.borrowAsset = borrowAsset
    this.collateralAsset = collateralAsset
    this.accountAddress = accountAddress
    this.loanId = loanId
    this.repayAmount = repayAmount
    this.repayPercent = repayPercent
    this.amountOwed = amountOwed
  }
}
