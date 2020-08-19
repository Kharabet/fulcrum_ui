
import { EarnRewardEvent } from "../domain/events/EarnRewardEvent";
import { PayTradingFeeEvent } from "../domain/events/PayTradingFeeEvent";
import { TradeEvent } from "../domain/events/TradeEvent";
import { LiquidationEvent } from "../domain/events/LiquidationEvent";
import { CloseWithSwapEvent } from "../domain/events/CloseWithSwapEvent";

export interface IHistoryEvents {
  groupedEvents: (TradeEvent | CloseWithSwapEvent | LiquidationEvent)[];
  earnRewardEvents: EarnRewardEvent[];
  payTradingFeeEvents: PayTradingFeeEvent[];
}