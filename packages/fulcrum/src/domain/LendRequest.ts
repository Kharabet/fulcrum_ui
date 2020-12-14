import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'

import { LendType } from './LendType'

export class LendRequest {
  public id: number
  public lendType: LendType
  public asset: Asset
  public amount: BigNumber
  public loanId?: string

  constructor(lendType: LendType, asset: Asset, amount: BigNumber) {
    this.id = Math.round(new Date().getTime() / 1000) + Math.floor(Math.random() * 10)
    this.lendType = lendType
    this.asset = asset
    this.amount = amount
  }

  public getRequestTypeName(): string {
    return (this.lendType === LendType.LEND ? 'Lend' : 'UnLend') + ' request'
  }
}
