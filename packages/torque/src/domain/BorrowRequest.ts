import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import moment from "moment";

export class BorrowRequest {
  public id: number;
  public loanId: string;
  public borrowAsset: Asset;
  public borrowAmount: BigNumber;
  public collateralAsset: Asset;
  public depositAmount: BigNumber;

  constructor(loanId: string, borrowAsset: Asset, borrowAmount: BigNumber, collateralAsset: Asset, depositAmount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10);
    this.loanId = loanId;
    this.borrowAsset = borrowAsset;
    this.borrowAmount = borrowAmount;
    this.collateralAsset = collateralAsset;
    this.depositAmount = depositAmount;
  }
}
