import { BigNumber } from '@0x/utils'
import { Asset } from './Asset'

export interface IActiveLoanData {
  loanId: string
  loanAsset: Asset
  collateralAsset: Asset
  amountOwedUsd: BigNumber
  maxLiquidatable: BigNumber
  maxSeizable: BigNumber
  loanData?: {
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
  }
}
