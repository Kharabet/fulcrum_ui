import * as mobx from 'mobx'
import { RootStore, StakingStore } from 'src/stores'

type rewardVMProps = 'inputRestake'

export default class RewardsVM {
  [name: string]: any
  public rootStore: RootStore
  public stakingStore: StakingStore
  public inputRestake = true

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
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
