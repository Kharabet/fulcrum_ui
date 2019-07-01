import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class RepayLoanRequest {
  public asset: Asset;
  public repayPercent: BigNumber;

  constructor(asset: Asset, repayPercent: BigNumber) {
    this.asset = asset;
    this.repayPercent = repayPercent;
  }
}
