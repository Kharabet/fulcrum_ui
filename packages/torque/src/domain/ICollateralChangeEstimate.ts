import { BigNumber } from "@0x/utils";

export interface ICollateralChangeEstimate {
  diffAmount: number;
  collateralizedPercent: BigNumber;
  liquidationPrice: BigNumber;
  gasEstimate: BigNumber;
}
