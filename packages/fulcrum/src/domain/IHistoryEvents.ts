import { CloseWithSwapEvent } from '../domain/events/CloseWithSwapEvent'
import { EarnRewardEvent } from '../domain/events/EarnRewardEvent'
import { LiquidationEvent } from '../domain/events/LiquidationEvent'
import { PayTradingFeeEvent } from '../domain/events/PayTradingFeeEvent'
import { TradeEvent } from '../domain/events/TradeEvent'
import { DepositCollateralEvent } from './events/DepositCollateralEvent'
import { EarnRewardEventNew } from './events/EarnRewardEventNew'
import { RolloverEvent } from './events/RolloverEvent'
import { WithdrawCollateralEvent } from './events/WithdrawCollateralEvent'

export interface IHistoryEvents {
  groupedEvents: Array<
    | TradeEvent
    | RolloverEvent
    | CloseWithSwapEvent
    | LiquidationEvent
    | WithdrawCollateralEvent
    | DepositCollateralEvent
  >
  earnRewardEvents: Array<(EarnRewardEvent|EarnRewardEventNew)>
  payTradingFeeEvents: PayTradingFeeEvent[]
}
