import * as mobx from 'mobx'
import GovernanceProposal from 'bzx-common/src/domain/staking/GovernanceProposal'
import { StakingProvider } from 'src/services/StakingProvider'
import RootStore from 'src/stores/RootStore'

type GovernanceStoreProp = 'pending' | 'stakingProvider' | 'error' | 'proposalsList'

export default class GovernanceStore {
  public rootStore: RootStore
  public proposalsList: GovernanceProposal[] = []
  public pending = false
  public stakingProvider: StakingProvider
  public error: Error | null = null

  public get listFailedToLoad() {
    return this.error && this.proposalsList.length === 0
  }

  /**
   * Reset error state to null for any model that might have an error.
   * stakingStore.error computed value will be null as a result.
   */
  public clearError() {
    this.error = null
  }

  public clearProposals() {
    this.proposalsList = []
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: GovernanceStoreProp, value: any) {
    this[prop] = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public async getProposals() {
    try {
      const sp = this.stakingProvider
      this.assign({ error: null, pending: true })
      const proposals = await sp.getGovernanceProposals()
      this.set('proposalsList', proposals)
    } catch (err) {
      err.title = 'Failed to get proposals'
      this.set('error', err)
      console.error(err)
    } finally {
      this.set('pending', false)
    }
  }

  constructor(rootStore: RootStore) {
    const { stakingProvider } = rootStore
    this.rootStore = rootStore
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
