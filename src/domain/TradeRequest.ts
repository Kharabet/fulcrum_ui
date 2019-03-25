import BigNumber from "bignumber.js";
import { Asset } from "./Asset";
import { PositionType } from "./PositionType";

export class TradeRequest {
  public asset: Asset;
  public positionType: PositionType;
  public leverage: number;
  public amount: BigNumber;

  constructor(asset: Asset, positionType: PositionType, leverage: number, amount: BigNumber) {
    this.asset = asset;
    this.positionType = positionType;
    this.leverage = leverage;
    this.amount = amount;
  }
}
