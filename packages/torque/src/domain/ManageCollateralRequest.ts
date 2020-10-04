import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class ManageCollateralRequest {
  public id: number;
  public loanId: string;
  public collateralAsset: Asset;
  public collateralAmount: BigNumber;
  public isWithdrawal: boolean;

  constructor(loanId: string, collateralAsset: Asset, collateralAmount: BigNumber, isWithdrawal: boolean) {
    this.id = Math.round(new Date().getTime() / 1000);
    this.loanId = loanId;
    this.collateralAsset = collateralAsset;
    this.collateralAmount = collateralAmount;
    this.isWithdrawal = isWithdrawal;
  }
}
