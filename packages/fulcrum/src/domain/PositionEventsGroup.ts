import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";

export class PositionEventsGroup {
  public events: HistoryEvent[] = [];
  public readonly loanId: string;
  public readonly baseToken: Asset;
  public readonly quoteToken: Asset;
  public readonly positionType: PositionType;
  public readonly leverage: number;

  constructor(
    loanId: string,
    baseToken: Asset,
    quoteToken: Asset,
    positionType: PositionType,
    leverage: number,
  ) {
    this.loanId = loanId;
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    this.positionType = positionType;
    this.leverage = leverage;
  }
}

export class HistoryEvent {
  public readonly loanId: string;
  public readonly date: Date;
  public readonly action: string;
  public readonly positionValue: BigNumber;
  public readonly tradePrice: BigNumber;
  public readonly value: BigNumber;
  public readonly profit: BigNumber | string;
  public readonly txHash: string;

  constructor(
    loanId: string,
    date: Date,
    action: string,
    positionValue: BigNumber,
    tradePrice: BigNumber,
    value: BigNumber,
    profit: BigNumber | string,
    txHash: string,
  ) {
    this.loanId = loanId;
    this.date = date;
    this.action = action;
    this.positionValue = positionValue;
    this.tradePrice = tradePrice;
    this.value = value;
    this.profit = profit;
    this.txHash = txHash;
  }
}
