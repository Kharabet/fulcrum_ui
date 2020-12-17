import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import StakingStore from './StakingStore'
import UIStore from './UIStore'
import Web3Connection from './Web3Connection'

export default class RootStore {
  public stakingStore: StakingStore
  public stakingProvider: StakingProvider
  public web3Connection: Web3Connection
  public uiStore: UIStore
  public etherscanURL = ''

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public init() {
    const sp = this.stakingProvider
    sp.on(
      'ProviderIsChanging',
      mobx.action(() => {
        this.web3Connection.providerIsChanging = true
      })
    )
    sp.on(
      'ProviderChanged',
      mobx.action((event) => {
        this.web3Connection.providerIsChanging = false
        this.web3Connection.supportedNetwork = !sp.unsupportedNetwork
        this.web3Connection.providerType = event.providerType
        this.web3Connection.activatingProvider = null
        this.web3Connection.walletAddress = sp.getCurrentAccount() || ''
        this.etherscanURL = sp.web3ProviderSettings ? sp.web3ProviderSettings.etherscanURL : ''
      })
    )
    this.stakingStore.init()
    mobx.when(
      () => !!this.web3Connection.web3React,
      () => this.web3Connection.checkAndStartStoredProvider()
    )
  }

  constructor({ stakingProvider }: { stakingProvider: StakingProvider }) {
    this.stakingProvider = stakingProvider
    this.stakingStore = new StakingStore(this)
    this.web3Connection = new Web3Connection(this)
    this.uiStore = new UIStore(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
