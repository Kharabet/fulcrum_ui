import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { WalletType } from "./WalletType";

export class BorrowRequest {
  public walletType: WalletType;
  public borrowAsset: Asset;
  public borrowAmount: BigNumber;
  public collateralAsset: Asset;
  public depositAmount: BigNumber;

  constructor(walletType: WalletType, borrowAsset: Asset, borrowAmount: BigNumber, collateralAsset: Asset, depositAmount: BigNumber) {
    this.walletType = walletType;
    this.borrowAsset = borrowAsset;
    this.borrowAmount = borrowAmount;
    this.collateralAsset = collateralAsset;
    this.depositAmount = depositAmount;
  }
}
