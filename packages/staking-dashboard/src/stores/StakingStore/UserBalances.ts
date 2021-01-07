// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import Asset from 'src/domain/Asset'
import { StakingProvider } from 'src/services/StakingProvider'

type userBalanceProp = 'pending' | 'stakingProvider' | 'error'
type tokens = 'bpt' | 'bzrx' | 'vbzrx' | 'ibzrx' | 'crv'

class TokenBalances {
  [name: string]: any
  public bzrx = new BigNumber(0)
  public ibzrx = new BigNumber(0)
  public bpt = new BigNumber(0)
  public vbzrx = new BigNumber(0)
  public crv = new BigNumber(0)

  get isEmpty() {
    // Note: we dont count CRV because we dont use it for staking, it's just a reward
    return this.bzrx.isZero() && this.ibzrx.isZero() && this.bpt.isZero() && this.vbzrx.isZero()
  }

  /**
   * An helper that tells if user wallet balances are enough to stake / unstake
   */
  get isWorthEnough() {
    return this.bzrx.gte(0.01) || this.ibzrx.gte(0.01) || this.bpt.gte(0.01) || this.vbzrx.gte(0.01)
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: tokens, value: BigNumber) {
    this[prop] = value
  }

  public add(amounts: {
    bzrx?: BigNumber
    vbzrx?: BigNumber
    ibzrx?: BigNumber
    bpt?: BigNumber
    crv?: BigNumber
  }) {
    if (amounts.bzrx) {
      this.bzrx = this.bzrx.plus(amounts.bzrx)
    }
    if (amounts.vbzrx) {
      this.vbzrx = this.vbzrx.plus(amounts.vbzrx)
    }
    if (amounts.ibzrx) {
      this.ibzrx = this.ibzrx.plus(amounts.ibzrx)
    }
    if (amounts.bpt) {
      this.bpt = this.bpt.plus(amounts.bpt)
    }
    if (amounts.crv) {
      this.crv = this.crv.plus(amounts.crv)
    }
  }

  public substract(amounts: {
    bzrx?: BigNumber
    vbzrx?: BigNumber
    ibzrx?: BigNumber
    bpt?: BigNumber
    crv?: BigNumber
  }) {
    if (amounts.bzrx) {
      this.bzrx = this.bzrx.minus(amounts.bzrx)
    }
    if (amounts.vbzrx) {
      this.vbzrx = this.vbzrx.minus(amounts.vbzrx)
    }
    if (amounts.ibzrx) {
      this.ibzrx = this.ibzrx.minus(amounts.ibzrx)
    }
    if (amounts.bpt) {
      this.bpt = this.bpt.minus(amounts.bpt)
    }
    if (amounts.crv) {
      this.crv = this.crv.minus(amounts.crv)
    }
  }

  public clearBalances() {
    this.bzrx = new BigNumber(0)
    this.ibzrx = new BigNumber(0)
    this.bpt = new BigNumber(0)
    this.vbzrx = new BigNumber(0)
    this.crv = new BigNumber(0)
  }

  constructor() {
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}

export default class UserBalances {
  [name: string]: any
  public wallet = new TokenBalances()
  public staked = new TokenBalances()
  public pending = false
  public stakingProvider: StakingProvider
  public error: Error | null = null

  get total() {
    return {
      bzrx: this.wallet.bzrx.plus(this.staked.bzrx),
      ibzrx: this.wallet.ibzrx.plus(this.staked.ibzrx),
      vbzrx: this.wallet.vbzrx.plus(this.staked.vbzrx),
      bpt: this.wallet.bpt.plus(this.staked.bpt)
    }
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: userBalanceProp, value: any) {
    this[prop] = value
  }

  public async getUserBalances() {
    try {
      const sp = this.stakingProvider
      this.set('pending', true)
      this.wallet.set('bzrx', (await sp.getAssetTokenBalanceOfUser(Asset.BZRX)).div(10 ** 18))
      this.wallet.set('vbzrx', (await sp.getAssetTokenBalanceOfUser(Asset.VBZRX)).div(10 ** 18))
      this.wallet.set('ibzrx', (await sp.getAssetTokenBalanceOfUser(Asset.IBZRX)).div(10 ** 18))
      this.wallet.set('bpt', (await sp.getAssetTokenBalanceOfUser(Asset.BPT)).div(10 ** 18))
      this.wallet.set('crv', (await sp.getAssetTokenBalanceOfUser(Asset.CRV)).div(10 ** 18))
      const stakedAmounts = await sp.getStakedBalances()
      mobx.runInAction(() => {
        this.staked.bzrx = stakedAmounts.bzrx.div(10 ** 18)
        this.staked.vbzrx = stakedAmounts.vbzrx.div(10 ** 18)
        this.staked.ibzrx = stakedAmounts.ibzrx.div(10 ** 18)
        this.staked.bpt = stakedAmounts.bpt.div(10 ** 18)
      })
      return { wallet: this.wallet, staked: this.staked }
    } catch (err) {
      err.title = 'Failed to get balances'
      this.set('error', err)
      console.error(err)
    } finally {
      this.set('pending', false)
    }
  }

  public clearBalances() {
    this.wallet.clearBalances()
    this.staked.clearBalances()
  }

  constructor(stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
