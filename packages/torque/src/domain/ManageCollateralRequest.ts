import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export class ManageCollateralRequest {
  public loanOrderHash: string;
  public repayPercent: BigNumber;

  constructor(loanOrderHash: string, collateralPercent: BigNumber) {
    this.loanOrderHash = loanOrderHash;
    this.repayPercent = collateralPercent;
  }
}
