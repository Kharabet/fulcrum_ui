import * as mobx from 'mobx'
import { ChangeEvent } from 'react'

import { RootStore, StakingStore } from 'src/stores'
import { DialogVM } from 'ui-framework'

export default class GovernanceVM {
  [name: string]: any
  public rootStore: RootStore

  public stakingStore: StakingStore
  public proposals = new DialogVM()

  public search() {}

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.stakingStore = rootStore.stakingStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
