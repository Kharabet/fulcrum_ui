import { BigNumber } from "@0x/utils";
import { IWalletDetails } from "./IWalletDetails";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

export class ManageCollateralRequest {
  public walletDetails: IWalletDetails;
  public loanOrderState: IBorrowedFundsState;
  public collateralAmount: BigNumber;
  public isWithdrawal: boolean;

  constructor(walletDetails: IWalletDetails, loanOrderState: IBorrowedFundsState, collateralAmount: BigNumber, isWithdrawal: boolean) {
    this.walletDetails = walletDetails;
    this.loanOrderState = loanOrderState;
    this.collateralAmount = collateralAmount;
    this.isWithdrawal = isWithdrawal;
  }
}
