import { IWalletDetails } from "./IWalletDetails";

export class ExtendLoanRequest {
  public walletDetails: IWalletDetails;
  public accountAddress: string;
  public loanOrderHash: string;
  public daysToAdd: number;

  constructor(walletDetails: IWalletDetails, accountAddress: string, loanOrderHash: string, daysToAdd: number) {
    this.walletDetails = walletDetails;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.daysToAdd = daysToAdd;
  }
}
