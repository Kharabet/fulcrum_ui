import BigNumber from "bignumber.js";
import moment from "moment";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";
import { TradeType } from "./TradeType";

export class TradeRequest {
  public id: number;
  public tradeType: TradeType;
  public asset: Asset;
  public positionType: PositionType;
  public leverage: number;
  public amount: BigNumber;

  constructor(tradeType: TradeType, asset: Asset, positionType: PositionType, leverage: number, amount: BigNumber) {
    this.id = moment().unix();
    this.tradeType = tradeType;
    this.asset = asset;
    this.positionType = positionType;
    this.leverage = leverage;
    this.amount = amount;
  }

  public getRequestTypeName(): string {
    return (this.tradeType === TradeType.BUY ? "Buy" : "Sell") + " request";
  }
}
