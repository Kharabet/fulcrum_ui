import { BigNumber } from "@0x/utils";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { Asset } from "./Asset";

export class ManageCollateralRequest {
  public id: number;
  public loanOrderState: IBorrowedFundsState;
  public isWithdrawal: boolean;
  public asset: Asset;

  constructor(loanOrderState: IBorrowedFundsState, isWithdrawal: boolean, asset?: Asset) {
    this.id = Math.round(new Date().getTime() / 1000);
    this.loanOrderState = loanOrderState;
    this.isWithdrawal = isWithdrawal;
    this.asset = asset ? asset : Asset.ETH;
  }
  public getRequestTypeName(): string {
    return (!this.isWithdrawal ? "Withdraw" : "Top Up") + " request";
  }
}
