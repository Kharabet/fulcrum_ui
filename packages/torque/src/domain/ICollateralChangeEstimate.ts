import { BigNumber } from "@0x/utils";

export interface ICollateralChangeEstimate {
  diffAmount: number;
  liquidationPrice: BigNumber;
  gasEstimate: BigNumber;
}
