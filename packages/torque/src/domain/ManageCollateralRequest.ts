import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";
import { IWalletDetails } from "./IWalletDetails";

export class ManageCollateralRequest {
  public walletDetails: IWalletDetails;
  public accountAddress: string;
  public loanOrderHash: string;
  public repayPercent: BigNumber;

  constructor(walletDetails: IWalletDetails, accountAddress: string, loanOrderHash: string, collateralPercent: BigNumber) {
    this.walletDetails = walletDetails;
    this.accountAddress = accountAddress;
    this.loanOrderHash = loanOrderHash;
    this.repayPercent = collateralPercent;
  }
}
