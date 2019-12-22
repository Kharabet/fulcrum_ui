import { BigNumber } from "@0x/utils";

export class ManageCollateralRequest {
  public collateralPercent: BigNumber;

  constructor(collateralPercent: BigNumber) {
    this.collateralPercent = collateralPercent;
  }
}
