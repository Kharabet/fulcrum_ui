import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface IBorrowedFundsState {
  accountAddress: string;
  loanOrderHash: string;
  asset: Asset;
  amount: BigNumber;
  amountOwed: BigNumber;
  interestRate: BigNumber;
  collateralizedPercent: BigNumber;
  hasManagementContract: boolean;
  isInProgress: boolean;
}
