import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import SpendingAllowance from './SpendingAllowance'
import UserBalances from './UserBalances'

export default class StakingAllowances {
  [name: string]: any
  private userBalances: UserBalances
  public bzrx: SpendingAllowance
  public vbzrx: SpendingAllowance
  public ibzrx: SpendingAllowance
  public bpt: SpendingAllowance

  public get error() {
    return this.bzrx.error || this.vbzrx.error || this.ibzrx.error || this.bpt.error || null
  }

  public get list() {
    return [this.bzrx, this.vbzrx, this.ibzrx, this.bpt]
  }

  public get needApprovalList() {
    const { wallet } = this.userBalances
    return this.list.filter((allowance) => {
      const token = allowance.tokenName.toLowerCase()
      return allowance.checked && wallet[token].gt(0.01) && allowance.amount.lt(wallet[token])
    })
  }

  public clearError() {
    this.list.forEach((approval) => (approval.error = null))
  }

  public async check() {
    const { wallet } = this.userBalances

    if (wallet.bzrx.gt(0.01)) {
      await this.bzrx.check()
    }

    if (wallet.vbzrx.gt(0.01)) {
      await this.vbzrx.check()
    }

    if (wallet.ibzrx.gt(0.01)) {
      await this.ibzrx.check()
    }

    if (wallet.bpt.gt(0.01)) {
      await this.bpt.check()
    }
  }

  constructor(stakingProvider: StakingProvider, userBalances: UserBalances) {
    this.userBalances = userBalances
    this.bzrx = new SpendingAllowance('BZRX', stakingProvider)
    this.vbzrx = new SpendingAllowance('VBZRX', stakingProvider)
    this.ibzrx = new SpendingAllowance('IBZRX', stakingProvider)
    this.bpt = new SpendingAllowance('BPT', stakingProvider)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
