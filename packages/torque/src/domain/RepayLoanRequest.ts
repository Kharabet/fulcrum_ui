import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { IWalletDetails } from "./IWalletDetails";

export class RepayLoanRequest {
  public walletDetails: IWalletDetails;
  public borrowAsset: Asset;
  public collateralAsset: Asset;
  public accountAddress: string;
  public loanOrderHash: string;
  public repayAmount: BigNumber;
  public repayPercent: BigNumber;
  public actualAmountOwed: BigNumber;

  constructor(walletDetails: IWalletDetails, borrowAsset: Asset, collateralAsset: Asset, accountAddress: string, loanOrderHash: string, repayAmount: BigNumber, repayPercent: BigNumber, actualAmountOwed: BigNumber) {
    this.walletDetails = walletDetails;
    this.borrowAsset = borrowAsset;
    this.collateralAsset = collateralAsset;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.repayAmount = repayAmount;
    this.repayPercent = repayPercent;
    this.actualAmountOwed = actualAmountOwed;
  }
}
