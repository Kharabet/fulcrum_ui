import { EarnRewardEvent } from '../domain/events/EarnRewardEvent'
import { PayTradingFeeEvent } from '../domain/events/PayTradingFeeEvent'
import { TradeEvent } from '../domain/events/TradeEvent'
import { LiquidationEvent } from '../domain/events/LiquidationEvent'
import { CloseWithSwapEvent } from '../domain/events/CloseWithSwapEvent'
import { DepositCollateralEvent } from './events/DepositCollateralEvent'
import { WithdrawCollateralEvent } from './events/WithdrawCollateralEvent'
import { EarnRewardEventNew } from './events/EarnRewardEventNew'

export interface IHistoryEvents {
  groupedEvents: (
    | TradeEvent
    | CloseWithSwapEvent
    | LiquidationEvent
    | WithdrawCollateralEvent
    | DepositCollateralEvent
  )[]
  earnRewardEvents: Array<(EarnRewardEvent|EarnRewardEventNew)>
  payTradingFeeEvents: PayTradingFeeEvent[]
}
