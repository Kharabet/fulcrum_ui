import { BigNumber } from '@0x/utils'
import { IRefinanceLoan } from './RefinanceData'
import moment from 'moment'

export class RefinanceDydxRequest {
  public id: number
  public refLoan: IRefinanceLoan
  public loanAmount: BigNumber

  constructor(refLoan: IRefinanceLoan, loanAmount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10)
    this.refLoan = refLoan
    this.loanAmount = loanAmount
  }
}
