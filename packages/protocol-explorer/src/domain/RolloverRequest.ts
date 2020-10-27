import { BigNumber } from '@0x/utils'
import { Asset } from './Asset'

export class RolloverRequest {
  public id: number
  public loanId: string

  constructor(loanId: string) {
    this.id = Math.round(new Date().getTime() / 1000)
    this.loanId = loanId
  }
}
