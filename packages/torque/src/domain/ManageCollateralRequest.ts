import { BigNumber } from "@0x/utils";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

export class ManageCollateralRequest {
  public loanOrderState: IBorrowedFundsState;
  public collateralAmount: BigNumber;
  public isWithdrawal: boolean;

  constructor(loanOrderState: IBorrowedFundsState, collateralAmount: BigNumber, isWithdrawal: boolean) {
    this.loanOrderState = loanOrderState;
    this.collateralAmount = collateralAmount;
    this.isWithdrawal = isWithdrawal;
  }
}
