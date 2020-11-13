import { BigNumber } from '@0x/utils'
import { PayTradingFeeEvent } from './events/PayTradingFeeEvent'
import { EarnRewardEvent } from './events/EarnRewardEvent'
import { Asset } from '../domain/Asset'
import { EarnRewardEventNew } from './events/EarnRewardEventNew'

export class PositionHistoryData {
  public readonly loanId: string
  public readonly date: Date
  public readonly action: string
  public readonly positionValue: BigNumber
  public readonly tradePrice: BigNumber
  public readonly value: BigNumber
  public readonly profit: BigNumber | string
  public readonly quoteToken: Asset
  public readonly txHash: string
  public readonly payTradingFeeEvent: PayTradingFeeEvent | undefined
  public readonly earnRewardEvent: EarnRewardEvent | EarnRewardEventNew | undefined

  constructor(
    loanId: string,
    date: Date,
    action: string,
    positionValue: BigNumber,
    tradePrice: BigNumber,
    value: BigNumber,
    profit: BigNumber | string,
    txHash: string,
    quoteToken: Asset,
    payTradingFeeEvent: PayTradingFeeEvent | undefined,
    earnRewardEvent: EarnRewardEvent | EarnRewardEventNew | undefined
  ) {
    this.loanId = loanId
    this.date = date
    this.action = action
    this.positionValue = positionValue
    this.tradePrice = tradePrice
    this.value = value
    this.profit = profit
    this.txHash = txHash
    this.quoteToken = quoteToken
    this.payTradingFeeEvent = payTradingFeeEvent
    this.earnRewardEvent = earnRewardEvent
  }
}
