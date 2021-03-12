import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import StakingStore from './StakingStore'
import TransactionStore from './TransactionStore'
import UIStore from './UIStore'
import Web3Connection from './Web3Connection'
import appConfig from 'src/config/appConfig'
import errorUtils from 'bzx-common/src/lib/errorUtils'
import GovernanceStore from './GovernanceStore'

export default class RootStore {
  public stakingStore: StakingStore
  public transactionStore: TransactionStore
  public stakingProvider: StakingProvider
  public governanceStore: GovernanceStore
  public web3Connection: Web3Connection
  public uiStore: UIStore
  public etherscanURL = appConfig.web3ProviderSettings.etherscanURL

  public get appError(): { error: any; stackMessages: string } | null {
    // TODO: fix typescript any
    const error = this.stakingStore.error
    if (error) {
      return {
        error,
        stackMessages: errorUtils.getErrorStackMessages(error)
      }
    }

    const governanceError = this.governanceStore.error
    if (governanceError) {
      return {
        error: governanceError,
        stackMessages: errorUtils.getErrorStackMessages(governanceError)
      }
    }
    return null
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public clearError() {
    this.stakingStore.clearError()
    this.governanceStore.clearError()
  }

  public init() {
    this.web3Connection.init()
    this.stakingStore.init()
    this.transactionStore.init()

    /**
     * Trying to manage errors in a centralized way.
     * Some "errors" that may popup are actually voluntary. eg: user decides to cancel transaction
     * In this cases, we try to detect it and set a flag. If it's not a "real" error, we dismiss it
     * after a short time. @see lib/errorUtils.js
     */
    mobx.autorun(() => {
      if (this.appError && this.appError.error.noError) {
        setTimeout(() => {
          this.clearError()
        }, 4000)
      }
    })
  }

  constructor({ stakingProvider }: { stakingProvider: StakingProvider }) {
    this.stakingProvider = stakingProvider
    this.transactionStore = new TransactionStore(this)
    this.stakingStore = new StakingStore(this)
    this.governanceStore = new GovernanceStore(this)
    this.web3Connection = new Web3Connection(this)
    this.uiStore = new UIStore(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
