// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import StakingStore from '../StakingStore'
import errorUtils from 'app-lib/errorUtils'

type rewardsProp =
  | 'bzrx'
  | 'bzrxVesting'
  | 'error'
  | 'pendingRebateRewards'
  | 'pendingStakingRewards'
  | 'pendingVbzrxClaim'
  | 'rebateRewards'
  | 'stableCoin'
  | 'stableCoinVesting'
  | 'stakingProvider'
  | 'vestedVbzrx'

export default class Rewards {
  /**
   * BZRX received from staking
   */
  public bzrx = new BigNumber(0)
  /**
   * BZRX pending to received from staked vbzrx
   */
  public bzrxVesting = new BigNumber(0)
  public error: Error | null = null
  public pendingRebateRewards = false
  public pendingStakingRewards = false
  public pendingVbzrxClaim = false
  /**
   * Amount of vbzrx that the user receives from the fees when using the platform
   */
  public rebateRewards = new BigNumber(0)
  /**
   * "stablecoin" is actually the balance of 3CRV tokens that user can claim.
   * (It's called stablecoin in the contracts)
   */
  public stableCoin = new BigNumber(0)
  public stableCoinVesting = new BigNumber(0)
  public stakingProvider: StakingProvider
  public stakingStore: StakingStore
  /**
   * Balance of BZRX that the user can claim from his vested BZRX
   */
  public vestedVbzrx = new BigNumber(0)

  get canClaimStakingRewards() {
    return this.bzrx.gt(0.01) || this.stableCoin.gt(0.01)
  }

  get canClaimRebateRewards() {
    return this.rebateRewards.gt(0.01)
  }

  get canClaimVestedBZRX() {
    return this.vestedVbzrx.gt(0.01)
  }

  /**
   * Helper to set the value of one prop through a mobx action.
   */
  public set(prop: rewardsProp, value: any) {
    this[prop] = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public async getAllRewards() {
    this.assign({ error: null, pendingStakingRewards: true })
    try {
      const sp = this.stakingProvider
      this.set('rebateRewards', await sp.getRebateRewards())
      const rewards = await sp.getStakingRewards()
      this.assign(rewards)
      const vestedBzrx = await this.stakingProvider.getVestedBzrxBalance()
      this.set('vestedVbzrx', vestedBzrx.div(10 ** 18))
      return rewards
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to get rewards balances' })
      this.set('error', error)
    } finally {
      this.set('pendingStakingRewards', false)
    }
  }

  public async claimStakingRewards(shouldRestake: boolean = false) {
    this.assign({ error: null, pendingStakingRewards: true })
    const claimedAmounts = { bzrx: this.bzrx, stableCoin: this.stableCoin }
    try {
      await this.stakingProvider.claimStakingRewards(shouldRestake)
      this.assign({
        bzrx: new BigNumber(0),
        stableCoin: new BigNumber(0)
      })
      return claimedAmounts
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to claim rewards' })
      this.set('error', error)
      throw error
    } finally {
      this.set('pendingStakingRewards', false)
    }
  }

  /**
   * Rebate rewards are half the fees going back to the user in form of vbzrx
   */
  public async claimRebateRewards() {
    this.assign({ error: null, pendingRebateRewards: true })
    try {
      await this.stakingProvider.claimRebateRewards()
      const vbzrxAmount = this.rebateRewards
      this.set('rebateRewards', new BigNumber(0))
      return vbzrxAmount
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to claim rebate rewards' })
      this.set('error', error)
    } finally {
      this.set('pendingRebateRewards', false)
    }
  }

  /**
   * Mostly for users who hold vbzrx in their wallet and just want to claim their bzrx
   */
  public async claimVestedBzrx() {
    this.assign({ error: null, pendingVbzrxClaim: true })
    try {
      await this.stakingProvider.claimVestedBZRX()
      const bzrxAmount = this.vestedVbzrx
      this.set('vestedVbzrx', new BigNumber(0))
      return bzrxAmount
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to claim vested BZRX' })
      this.set('error', error)
    } finally {
      this.set('pendingVbzrxClaim', false)
    }
  }

  public clearBalances() {
    this.bzrx = new BigNumber(0)
    this.bzrxVesting = new BigNumber(0)
    this.rebateRewards = new BigNumber(0)
    this.stableCoin = new BigNumber(0)
    this.stableCoinVesting = new BigNumber(0)
    this.vestedVbzrx = new BigNumber(0)
  }

  constructor(stakingProvider: StakingProvider, stakingStore: StakingStore) {
    this.stakingProvider = stakingProvider
    this.stakingStore = stakingStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
