import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export class LiquidationEvent {
  public static readonly topic0: string =
    '0x46fa03303782eb2f686515f6c0100f9a62dabe587b0d3f5a4fc0c822d6e532d3'
  public readonly user: string //indexed
  public readonly liquidator: string //indexed
  public readonly loanId: string //indexed
  public readonly lender: string
  public readonly loanToken: Asset
  public readonly collateralToken: Asset
  public readonly repayAmount: BigNumber
  public readonly collateralWithdrawAmount: BigNumber
  public readonly collateralToLoanRate: BigNumber // one unit of baseToken, denominated in quoteToken
  public readonly currentMargin: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    user: string,
    liquidator: string,
    loanId: string,
    lender: string,
    loanToken: Asset,
    collateralToken: Asset,
    repayAmount: BigNumber,
    collateralWithdrawAmount: BigNumber,
    collateralToLoanRate: BigNumber,
    currentMargin: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.user = user
    this.liquidator = liquidator
    this.loanId = loanId
    this.lender = lender
    this.loanToken = loanToken
    this.collateralToken = collateralToken
    this.repayAmount = repayAmount
    this.collateralWithdrawAmount = collateralWithdrawAmount
    this.collateralToLoanRate = collateralToLoanRate
    this.currentMargin = currentMargin
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}
