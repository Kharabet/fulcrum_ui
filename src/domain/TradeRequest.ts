import BigNumber from "bignumber.js";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";
import { TradeType } from "./TradeType";

export class TradeRequest {
  public tradeType: TradeType;
  public asset: Asset;
  public positionType: PositionType;
  public leverage: number;
  public amount: BigNumber;

  constructor(tradeType: TradeType, asset: Asset, positionType: PositionType, leverage: number, amount: BigNumber) {
    this.tradeType = tradeType;
    this.asset = asset;
    this.positionType = positionType;
    this.leverage = leverage;
    this.amount = amount;
  }
}
