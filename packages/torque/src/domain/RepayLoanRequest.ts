import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class RepayLoanRequest {
  public borrowAsset: Asset;
  public collateralAsset: Asset;
  public accountAddress: string;
  public loanOrderHash: string;
  public repayAmount: BigNumber;
  public repayPercent: BigNumber;
  public amountOwed: BigNumber;

  constructor(borrowAsset: Asset, collateralAsset: Asset, accountAddress: string, loanOrderHash: string, repayAmount: BigNumber, repayPercent: BigNumber, amountOwed: BigNumber) {
    this.borrowAsset = borrowAsset;
    this.collateralAsset = collateralAsset;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.repayAmount = repayAmount;
    this.repayPercent = repayPercent;
    this.amountOwed = amountOwed;
  }
}
