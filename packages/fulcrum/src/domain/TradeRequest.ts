import { BigNumber } from '@0x/utils'
import { Asset } from './Asset'
import { PositionType } from './PositionType'
import { TradeType } from './TradeType'

export class TradeRequest {
  public loanId: string
  public id: number
  public tradeType: TradeType
  public asset: Asset
  public depositToken: Asset
  public quoteToken: Asset
  public positionType: PositionType
  public leverage: number
  public amount: BigNumber
  public loanDataBytes: string
  public returnTokenIsCollateral: boolean

  constructor(
    loanId: string,
    tradeType: TradeType,
    asset: Asset,
    quoteToken: Asset,
    depositToken: Asset,
    positionType: PositionType,
    leverage: number,
    amount: BigNumber,
    returnTokenIsCollateral?: boolean,
    loanDataBytes?: string
  ) {
    this.id = Math.round(new Date().getTime() / 1000)
    this.loanId = loanId
    this.tradeType = tradeType
    this.asset = asset
    this.depositToken = depositToken
    this.quoteToken = quoteToken
    this.positionType = positionType
    this.leverage = leverage
    this.amount = amount
    this.returnTokenIsCollateral =
      returnTokenIsCollateral !== undefined ? returnTokenIsCollateral : true
    this.loanDataBytes = loanDataBytes ? loanDataBytes : '0x'
  }

  public getRequestTypeName(): string {
    return (this.tradeType === TradeType.BUY ? 'Open' : 'Close') + ' request'
  }
}
