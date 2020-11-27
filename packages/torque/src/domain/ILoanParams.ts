import { BigNumber } from '@0x/utils'

export interface ILoanParams {
  loanId: string
  active: boolean
  owner: string
  loanToken: string
  collateralToken: string
  minInitialMargin: BigNumber
  maintenanceMargin: BigNumber
  maxLoanTerm: BigNumber
}
