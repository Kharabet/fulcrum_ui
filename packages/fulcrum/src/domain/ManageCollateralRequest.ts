import { BigNumber } from "@0x/utils";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { Asset } from "./Asset";

export class ManageCollateralRequest {
  public id: number;
  public loanId: string;
  public asset: Asset;
  public collateralAsset: Asset;
  public collateralAmount: BigNumber;

  public isWithdrawal: boolean;

  constructor(loanId: string,
    asset: Asset,
    collateralAsset: Asset,
    collateralAmount: BigNumber,
    isWithdrawal: boolean,
  ) {
    this.id = Math.round(new Date().getTime() / 1000);
    this.loanId = loanId;
    this.asset = asset;
    this.collateralAsset = collateralAsset;
    this.collateralAmount = collateralAmount;
    this.isWithdrawal = isWithdrawal;
  }
  public getRequestTypeName(): string {
    return (!this.isWithdrawal ? "Withdraw" : "Top Up") + " request";
  }
}
