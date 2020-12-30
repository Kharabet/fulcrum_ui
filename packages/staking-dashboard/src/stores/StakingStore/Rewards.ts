// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import ClaimRebateRewardsRequest from 'src/domain/ClaimRebateRewardsRequest'
import { StakingProvider } from 'src/services/StakingProvider'

type rewardsProp = 'error' | 'pending' | 'rebateRewards' | 'stakingProvider' | 'userEarnings'

export default class Rewards {
  public error: Error | null = null
  public pending = false
  public rebateRewards = new BigNumber(0)
  public stakingProvider: StakingProvider
  public userEarnings = new BigNumber(0)

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

  public async getRewards() {
    this.assign({ error: null, pending: true })
    try {
      const sp = this.stakingProvider
      this.set('userEarnings', await sp.getUserEarnings())
      this.set('rebateRewards', (await sp.getRebateRewards()).div(10 ** 18))
      return { userEarnings: this.userEarnings, rebateRewards: this.rebateRewards }
    } catch (err) {
      err.title = 'Staking | Failed to get rewards'
      this.set('error', err)
    } finally {
      this.set('pending', false)
    }
  }

  public async claimRewards() {
    this.stakingProvider.onRequestConfirmed(new ClaimRebateRewardsRequest()).catch((err) => {
      console.error(err)
    })
  }

  constructor(stakingProvider: StakingProvider) {
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
