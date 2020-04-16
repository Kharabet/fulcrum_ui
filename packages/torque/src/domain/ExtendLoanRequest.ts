import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class ExtendLoanRequest {
  public borrowAsset: Asset;
  public accountAddress: string;
  public loanOrderHash: string;
  public depositAmount: BigNumber;

  constructor(borrowAsset: Asset, accountAddress: string, loanOrderHash: string, depositAmount: BigNumber) {
    this.borrowAsset = borrowAsset;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.depositAmount = depositAmount;
  }
}
