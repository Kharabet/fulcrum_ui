import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface RefinanceData {
  collateralType: String;
  collateralAmount: BigNumber;
  debt: BigNumber;
  cdpId: BigNumber;

}
