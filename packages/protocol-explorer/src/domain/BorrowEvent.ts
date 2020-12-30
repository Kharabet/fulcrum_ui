import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export class BorrowEvent {
  public static topic0: string =
    '0x7bd8cbb7ba34b33004f3deda0fd36c92fc0360acbd97843360037b467a538f90'
  public readonly user: string //indexed
  public readonly lender: string //indexed
  public readonly loanId: string //indexed
  public readonly loanToken: Asset
  public readonly collateralToken: Asset
  public readonly newPrincipal: BigNumber
  public readonly newCollateral: BigNumber
  public readonly interestRate: BigNumber
  public readonly interestDuration: BigNumber
  public readonly collateralToLoanRate: BigNumber // one unit of loanToken, denominated in collateralToken
  public readonly currentMargin: BigNumber
  public readonly timeStamp: Date
  public readonly txHash: string

  constructor(
    user: string,
    lender: string,
    loanId: string,
    loanToken: Asset,
    collateralToken: Asset,
    newPrincipal: BigNumber,
    newCollateral: BigNumber,
    interestRate: BigNumber,
    interestDuration: BigNumber,
    collateralToLoanRate: BigNumber,
    currentMargin: BigNumber,
    timeStamp: Date,
    txHash: string
  ) {
    this.user = user
    this.lender = lender
    this.loanId = loanId
    this.loanToken = loanToken
    this.collateralToken = collateralToken
    this.newPrincipal = newPrincipal
    this.newCollateral = newCollateral
    this.interestRate = interestRate
    this.interestDuration = interestDuration
    this.collateralToLoanRate = collateralToLoanRate
    this.currentMargin = currentMargin
    this.timeStamp = timeStamp
    this.txHash = txHash
  }
}
