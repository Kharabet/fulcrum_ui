import { BigNumber } from "@0x/utils";
import { Asset } from "./Asset";

export interface IBorrowedFundsState {
  accountAddress: string;
  loanId: string;
  loanAsset: Asset;
  collateralAsset: Asset;
  amount: BigNumber;
  amountOwed: BigNumber;
  collateralAmount: BigNumber;
  interestRate: BigNumber;
  interestOwedPerDay: BigNumber;
  collateralizedPercent: BigNumber;
  hasManagementContract: boolean;
  isInProgress: boolean;
  loanData?: {
    loanId: string;
    loanToken: string;
    collateralToken: string;
    principal: BigNumber;
    collateral: BigNumber;
    interestOwedPerDay: BigNumber;
    interestDepositRemaining: BigNumber;
    minInitialMargin: BigNumber;
    maintenanceMargin: BigNumber;
    currentMargin: BigNumber;
    maxLoanTerm: BigNumber;
    loanEndTimestamp: BigNumber;
    maxLiquidatable: BigNumber;
    maxSeizable: BigNumber;
  };
}
