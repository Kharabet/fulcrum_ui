import _ from 'lodash'
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'

export interface ITokenAmounts {
  token: 'bzrx' | 'ibzrx' | 'vbzrx' | 'crv'
  amount: BigNumber
  staked: boolean
}

export default class WalletUpdate {
  public from: ITokenAmounts[] = []
  public to: ITokenAmounts[] = []
  public diffs: ITokenAmounts[] = []

  public switchAmounts() {
    const _from = this.from
    this.from = this.to
    this.to = _from
  }

  constructor(amounts: { from: ITokenAmounts[]; to: ITokenAmounts[] }) {
    this.from = amounts.from
    this.to = amounts.to
    this.diffs = _.map(amounts.from, (tokenAmount) => {
      const to = amounts.to.find((_tokenAmount) => _tokenAmount.token === tokenAmount.token)
      return {
        token: tokenAmount.token,
        amount: to!.amount.minus(tokenAmount.amount),
        staked: tokenAmount.staked
      }
    })
    mobx.makeAutoObservable(this, undefined, { deep: false, autoBind: true })
  }
}
