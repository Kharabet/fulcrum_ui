import * as mobx from 'mobx'
import GovernanceProposal from 'src/domain/GovernanceProposal'

import { RootStore, GovernanceStore } from 'src/stores'
import { DialogVM } from 'ui-framework'

export default class GovernanceVM {
  [name: string]: any
  public rootStore: RootStore

  public governanceStore: GovernanceStore
  public activeProposal?: GovernanceProposal
  public proposalPopup = new DialogVM({id: 'proposal-popup'})

  public showProposal = (id: number) => {
    this.activeProposal = this.governanceStore.proposalsList.find(proposal => proposal.id === id)
    this.activeProposal && this.proposalPopup.show()
  }

  public search() {}

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.governanceStore = rootStore.governanceStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
