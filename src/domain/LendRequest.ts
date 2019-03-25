import BigNumber from "bignumber.js";
import { Asset } from "./Asset";

export class LendRequest {
  public asset: Asset;
  public amount: BigNumber;

  constructor(asset: Asset, amount: BigNumber) {
    this.asset = asset;
    this.amount = amount;
  }
}
