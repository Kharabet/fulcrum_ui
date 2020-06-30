import { BigNumber } from "@0x/utils";import { PayTradingFeeEvent } from "./PayTradingFeeEvent";import { EarnRewardEvent } from "./EarnRewardEvent";

export class PositionHistoryData {
  public readonly loanId: string;
  public readonly date: Date;
  public readonly action: string;
  public readonly positionValue: BigNumber;
  public readonly tradePrice: BigNumber;
  public readonly value: BigNumber;
  public readonly profit: BigNumber | string;
  public readonly txHash: string;
  public readonly payTradingFeeEvent: PayTradingFeeEvent | undefined;
  public readonly earnRewardEvent: EarnRewardEvent | undefined;

  constructor(
    loanId: string,
    date: Date,
    action: string,
    positionValue: BigNumber,
    tradePrice: BigNumber,
    value: BigNumber,
    profit: BigNumber | string,
    txHash: string,
    payTradingFeeEvent: PayTradingFeeEvent | undefined,
    earnRewardEvent: EarnRewardEvent | undefined,
  ) {
    this.loanId = loanId;
    this.date = date;
    this.action = action;
    this.positionValue = positionValue;
    this.tradePrice = tradePrice;
    this.value = value;
    this.profit = profit;
    this.txHash = txHash;
    this.payTradingFeeEvent = payTradingFeeEvent;
    this.earnRewardEvent = earnRewardEvent;
  }
}
