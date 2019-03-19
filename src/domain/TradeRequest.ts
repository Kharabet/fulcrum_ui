import { Asset } from "./Asset";
import BigNumber from "bignumber.js";

export class TradeRequest {
  public asset: Asset;
  public leverage: number;
  public amount: BigNumber;

  constructor(asset: Asset, leverage: number, amount: BigNumber) {
    this.asset = asset;
    this.leverage = leverage;
    this.amount = amount;
  }
}
