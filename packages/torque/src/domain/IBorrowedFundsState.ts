import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface IBorrowedFundsState {
  accountAddress: string;
  loanOrderHash: string;
  asset: Asset;
  amount: BigNumber;
  amountOwed: BigNumber;
  interestRate: BigNumber;
  interestOwedPerDay: BigNumber;
  collateralizedPercent: BigNumber;
  hasManagementContract: boolean;
  isInProgress: boolean;
  loanData?: {
    loanOrderHash: string;
    loanTokenAddress: string;
    collateralTokenAddress: string;
    loanTokenAmountFilled: BigNumber;
    positionTokenAmountFilled: BigNumber;
    collateralTokenAmountFilled: BigNumber;
    interestOwedPerDay: BigNumber;
    interestDepositRemaining: BigNumber;
    initialMarginAmount: BigNumber;
    maintenanceMarginAmount: BigNumber;
    currentMarginAmount: BigNumber;
    maxDurationUnixTimestampSec: BigNumber;
    loanEndUnixTimestampSec: BigNumber;
  };
}
