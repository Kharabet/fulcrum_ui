import * as mobx from 'mobx'
import RootStore from '../RootStore'
import SpendingAllowance from './SpendingAllowance'
import UserBalances from './UserBalances'
import { stakeableToken } from 'src/domain/stakingTypes'

export default class StakingAllowances {
  [name: string]: any
  private rootStore: RootStore
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

  /**
   * TODO: refactor, probably dont need both list as array or map
   */
  public get needApprovals(): Map<stakeableToken, SpendingAllowance> {
    const map = new Map<stakeableToken, SpendingAllowance>()
    this.needApprovalList.forEach((allowance) => {
      map.set(allowance.tokenName.toLocaleLowerCase() as stakeableToken, allowance)
    })
    return map
  }

  public clearError() {
    this.list.forEach((approval) => (approval.error = null))
  }

  public async check() {
    const { walletAddress } = this.rootStore.web3Connection
    const sp = this.rootStore.stakingProvider
    const result = await sp.getStakeableAllowances(walletAddress)
    this.bzrx.assign({ amount: result.bzrx, checked: true })
    this.vbzrx.assign({ amount: result.vbzrx, checked: true })
    this.ibzrx.assign({ amount: result.ibzrx, checked: true })
    this.bpt.assign({ amount: result.bpt, checked: true })
  }

  constructor(userBalances: UserBalances, rootStore: RootStore) {
    this.userBalances = userBalances
    this.rootStore = rootStore
    this.bzrx = new SpendingAllowance('BZRX', this.rootStore.stakingProvider)
    this.vbzrx = new SpendingAllowance('VBZRX', this.rootStore.stakingProvider)
    this.ibzrx = new SpendingAllowance('IBZRX', this.rootStore.stakingProvider)
    this.bpt = new SpendingAllowance('BPT', this.rootStore.stakingProvider)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
