import BigNumber from "bignumber.js";

export class ManageCollateralRequest {
  public collateralPercent: BigNumber;

  constructor(collateralPercent: BigNumber) {
    this.collateralPercent = collateralPercent;
  }
}
