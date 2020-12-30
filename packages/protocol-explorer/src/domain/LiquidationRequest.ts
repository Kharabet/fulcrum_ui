import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

export class LiquidationRequest {
  public id: number
  public loanId: string  
  public loanToken: Asset
  public collateralToken: Asset
  public closeAmount: BigNumber
  public rate: BigNumber

  constructor(loanId: string, loanToken: Asset, collateralToken:Asset, closeAmount: BigNumber,rate:BigNumber) {
    this.id = Math.round(new Date().getTime() / 1000)
    this.loanId = loanId    
    this.loanToken = loanToken
    this.collateralToken = collateralToken
    this.closeAmount = closeAmount
    this.rate = rate
  }
}
