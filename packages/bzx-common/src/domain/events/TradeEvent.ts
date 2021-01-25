import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export default class TradeEvent {
  public static readonly topic0: string =
    '0xf640c1cfe1a912a0b0152b5a542e5c2403142eed75b06cde526cee54b1580e5c'
  public readonly user: string //indexed
  public readonly lender: string //indexed
  public readonly loanId: string //indexed
  public readonly collateralToken: Asset
  public readonly loanToken: Asset
  public readonly positionSize: BigNumber
  public readonly borrowedAmount: BigNumber
  public readonly interestRate: BigNumber
  public readonly settlementDate: Date
  public readonly entryPrice: BigNumber // one unit of baseToken, denominated in quoteToken
  public readonly entryLeverage: BigNumber
  public readonly currentLeverage: BigNumber
  public readonly blockNumber: BigNumber
  public readonly txHash: string

  constructor(
    user: string,
    lender: string,
    loanId: string,
    collateralToken: Asset,
    loanToken: Asset,
    positionSize: BigNumber,
    borrowedAmount: BigNumber,
    interestRate: BigNumber,
    settlementDate: Date,
    entryPrice: BigNumber,
    entryLeverage: BigNumber,
    currentLeverage: BigNumber,
    blockNumber: BigNumber,
    txHash: string
  ) {
    this.user = user
    this.collateralToken = collateralToken
    this.loanToken = loanToken
    this.lender = lender
    this.loanId = loanId
    this.positionSize = positionSize
    this.borrowedAmount = borrowedAmount
    this.interestRate = interestRate
    this.settlementDate = settlementDate
    this.entryPrice = entryPrice
    this.entryLeverage = entryLeverage
    this.currentLeverage = currentLeverage
    this.blockNumber = blockNumber
    this.txHash = txHash
  }
}
