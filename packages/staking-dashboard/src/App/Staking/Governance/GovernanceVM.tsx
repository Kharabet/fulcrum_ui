import * as mobx from 'mobx'
import { ChangeEvent } from 'react'

import { RootStore, GovernanceStore } from 'src/stores'
import { DialogVM } from 'ui-framework'

export default class GovernanceVM {
  [name: string]: any
  public rootStore: RootStore

  public governanceStore: GovernanceStore
  public proposals = new DialogVM()

  public search() {}

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.governanceStore = rootStore.governanceStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
