import { Asset } from "./Asset";
import BigNumber from "bignumber.js";

export class LoanRequest {
  public asset: Asset;
  public amount: BigNumber;

  constructor(asset: Asset, amount: BigNumber) {
    this.asset = asset;
    this.amount = amount;
  }
}
