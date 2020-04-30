import { BigNumber } from "@0x/utils";

export interface IBorrowMoreEstimate {
  depositAmount: BigNumber;
  balanceTooLow: boolean
}
