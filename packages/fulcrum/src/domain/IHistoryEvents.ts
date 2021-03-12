import {
  CloseWithSwapEvent,
  DepositCollateralEvent,
  EarnRewardEvent,
  EarnRewardEventNew,
  LiquidationEvent,
  PayTradingFeeEvent,
  RolloverEvent,
  TradeEvent,
  WithdrawCollateralEvent,
} from 'bzx-common/src/domain/events'

export interface IHistoryEvents {
  groupedEvents: Array<
    | TradeEvent
    | RolloverEvent
    | CloseWithSwapEvent
    | LiquidationEvent
    | WithdrawCollateralEvent
    | DepositCollateralEvent
  >
  earnRewardEvents: Array<EarnRewardEvent | EarnRewardEventNew>
  payTradingFeeEvents: PayTradingFeeEvent[]
}
