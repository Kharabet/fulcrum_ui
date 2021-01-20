import * as mobx from 'mobx'
import { RootStore, StakingStore } from 'src/stores'
import { DialogVM } from 'ui-framework'

export default class GovernanceVM {
  [name: string]: any
  public rootStore: RootStore

  public stakingStore: StakingStore
  public inputRestake = false
  public proposals = new DialogVM()

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.stakingStore = rootStore.stakingStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
