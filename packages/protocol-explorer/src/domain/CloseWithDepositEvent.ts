import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export class CloseWithDepositEvent {
  public static topic0: string =
    '0x6349c1a02ec126f7f4fc6e6837e1859006e90e9901635c442d29271e77b96fb6'
  public readonly user: string //indexed
  public readonly lender: string //indexed
  public readonly loanId: string //indexed
  public readonly closer: string
  public readonly loanToken: Asset
  public readonly collateralToken: Asset
  public readonly repayAmount: BigNumber
  public readonly collateralWithdrawAmount: BigNumber
  public readonly collateralToLoanRate: BigNumber // one unit of loanToken, denominated in collateralToken
  public readonly currentMargin: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    user: string,
    lender: string,
    loanId: string,
    closer: string,
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
    this.loanToken = loanToken
    this.collateralToken = collateralToken
    this.lender = lender
    this.closer = closer
    this.loanId = loanId
    this.repayAmount = repayAmount
    this.collateralWithdrawAmount = collateralWithdrawAmount
    this.collateralToLoanRate = collateralToLoanRate
    this.currentMargin = currentMargin
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}
