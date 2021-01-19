import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import moment from 'moment'
import { RefinanceData } from './RefinanceData'

export class RefinanceMakerRequest {
  public id: number
  public refLoan: RefinanceData
  public loanAmount: BigNumber

  constructor(refLoan: RefinanceData, loanAmount: BigNumber) {
    this.id = moment().unix() + Math.floor(Math.random() * 10)
    this.loanAmount = loanAmount
    this.refLoan = refLoan
  }
}
