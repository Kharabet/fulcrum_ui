import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface IBorrowedFundsState {
  loanOrderHash: string;
  asset: Asset;
  amount: BigNumber;
  interestRate: BigNumber;
  collateralizedPercent: BigNumber;
}
