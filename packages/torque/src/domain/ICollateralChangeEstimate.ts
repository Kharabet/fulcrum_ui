import { BigNumber } from "@0x/utils";

export interface ICollateralChangeEstimate {
  diffAmount: BigNumber;
  liquidationPrice: BigNumber;
}
