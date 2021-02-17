import * as mobx from 'mobx'
import { RootStore, StakingStore } from 'src/stores'
import Rewards from 'src/stores/StakingStore/Rewards'

type rewardVMProps = 'inputRestake'

export default class RewardsVM {
  public rootStore: RootStore
  public stakingStore: StakingStore
  public inputRestake = true
  public rewards: Rewards

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: rewardVMProps, value: any) {
    ;(this[prop] as any) = value
  }

  public claimStakingRewards() {
    return this.stakingStore.claimStakingRewards(this.inputRestake)
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.stakingStore = rootStore.stakingStore
    this.rewards = rootStore.stakingStore.rewards
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
