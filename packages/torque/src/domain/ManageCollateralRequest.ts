import { BigNumber } from "@0x/utils";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import moment from "moment";

export class ManageCollateralRequest {
  public id: number;
  public loanOrderState: IBorrowedFundsState;
  public collateralAmount: BigNumber;
  public isWithdrawal: boolean;

  constructor(loanOrderState: IBorrowedFundsState, collateralAmount: BigNumber, isWithdrawal: boolean) {
    this.id = moment().unix() + Math.floor(Math.random() * 10);
    this.loanOrderState = loanOrderState;
    this.collateralAmount = collateralAmount;
    this.isWithdrawal = isWithdrawal;
  }
}
