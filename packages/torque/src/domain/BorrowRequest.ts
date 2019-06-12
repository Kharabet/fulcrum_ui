import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class BorrowRequest {
  public borrowAsset: Asset;
  public borrowAmount: BigNumber;
  public collateralAsset: Asset;

  constructor(borrowAsset: Asset, borrowAmount: BigNumber, collateralAsset: Asset) {
    this.borrowAsset = borrowAsset;
    this.borrowAmount = borrowAmount;
    this.collateralAsset = collateralAsset;
  }
}
