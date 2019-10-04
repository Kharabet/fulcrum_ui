import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { IWalletDetails } from "./IWalletDetails";

export class ExtendLoanRequest {
  public walletDetails: IWalletDetails;
  public borrowAsset: Asset;
  public accountAddress: string;
  public loanOrderHash: string;
  public depositAmount: BigNumber;

  constructor(walletDetails: IWalletDetails, borrowAsset: Asset, accountAddress: string, loanOrderHash: string, depositAmount: BigNumber) {
    this.walletDetails = walletDetails;
    this.borrowAsset = borrowAsset;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.depositAmount = depositAmount;
  }
}
