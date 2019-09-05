import { BigNumber } from "@0x/utils";
import { IWalletDetails } from "./IWalletDetails";

export class RepayLoanRequest {
  public walletDetails: IWalletDetails;
  public accountAddress: string;
  public loanOrderHash: string;
  public repayPercent: BigNumber;

  constructor(walletDetails: IWalletDetails, loanOrderHash: string, accountAddress: string, repayPercent: BigNumber) {
    this.walletDetails = walletDetails;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.repayPercent = repayPercent;
  }
}
