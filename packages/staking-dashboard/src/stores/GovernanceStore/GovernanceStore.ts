// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import GovernanceProposal from 'src/domain/GovernanceProposal'
import { StakingProvider } from 'src/services/StakingProvider'
import RootStore from 'src/stores/RootStore'

type GovernanceStoreProp = 'pending' | 'stakingProvider' | 'governanceError' | 'proposalsList'

export default class GovernanceStore {
  [name: string]: any
  public rootStore: RootStore
  public proposalsList: GovernanceProposal[] = []
  public pending = false
  public stakingProvider: StakingProvider
  public governanceError: Error | null = null

  
  public get error() {
    return (
      this.governanceError
    )
  }
  
  /**
   * Reset error state to null for any model that might have an error.
   * stakingStore.error computed value will be null as a result.
   */
  public clearError() {
    this.governanceError = null
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

  public async getProposals() {
    try {
      const sp = this.stakingProvider
      this.set('pending', true)
      
      const proposals = await sp.getGovernanceProposals()
      this.set('proposalsList', proposals)

    } catch (err) {
      err.title = 'Failed to get proposals'
      this.set('governanceError', err)
      console.error(err)
    } finally {
      this.set('pending', false)
    }
  }
  
  
  /**
   * Meant to be called when provider changes
   */
  public async syncData() {
    if (this.rootStore.web3Connection.isConnected) {
      await this.getProposals()
    } else {
      this.clearProposals()
    }
  }

  public init() {
    const sp = this.stakingProvider
    sp.on('ProviderChanged', this.syncData)
  }

  constructor(rootStore: RootStore) {
    const { stakingProvider } = rootStore
    this.rootStore = rootStore
    this.stakingProvider = stakingProvider
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
