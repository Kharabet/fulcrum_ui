
import { EarnRewardEvent } from "../domain/EarnRewardEvent";
import { PayTradingFeeEvent } from "../domain/PayTradingFeeEvent";
import { TradeEvent } from "../domain/TradeEvent";
import { LiquidationEvent } from "../domain/LiquidationEvent";
import { CloseWithSwapEvent } from "../domain/CloseWithSwapEvent";

export interface IHistoryEvents {
  groupedEvents: (TradeEvent | CloseWithSwapEvent | LiquidationEvent)[];
  earnRewardEvents: EarnRewardEvent[];
  payTradingFeeEvents: PayTradingFeeEvent[];
}