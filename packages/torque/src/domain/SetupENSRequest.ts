import { IWalletDetails } from "./IWalletDetails";

export class SetupENSRequest {
  public walletDetails: IWalletDetails;
  public accountAddress: string;

  constructor(walletDetails: IWalletDetails, accountAddress: string) {
    this.walletDetails = walletDetails;
    this.accountAddress = accountAddress;
  }
}
