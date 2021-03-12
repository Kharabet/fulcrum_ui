import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export interface IBorrowedFundsState {
  accountAddress: string
  loanId: string
  loanAsset: Asset
  collateralAsset: Asset
  amount: BigNumber
  amountOwed: BigNumber
  collateralAmount: BigNumber
  interestRate: BigNumber
  interestOwedPerDay: BigNumber
  collateralizedPercent: BigNumber
  hasManagementContract: boolean
  isInProgress: boolean
  loanData: {
    loanId: string
    endTimestamp: BigNumber
    loanToken: string
    collateralToken: string
    principal: BigNumber
    collateral: BigNumber
    interestOwedPerDay: BigNumber
    interestDepositRemaining: BigNumber
    startRate: BigNumber
    startMargin: BigNumber
    maintenanceMargin: BigNumber
    currentMargin: BigNumber
    maxLoanTerm: BigNumber
    maxLiquidatable: BigNumber
    maxSeizable: BigNumber
    depositValueAsLoanToken: BigNumber
    depositValueAsCollateralToken: BigNumber
  }
}
