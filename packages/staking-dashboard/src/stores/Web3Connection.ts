import hashUtils from 'bzx-common/src/lib/hashUtils'
import * as mobx from 'mobx'
import ProviderType from 'bzx-common/src/domain/ProviderType'
import ProviderTypeDetails from 'bzx-common/src/domain/ProviderTypeDetails'
import ProviderTypeDictionary from 'bzx-common/src/domain/ProviderTypeDictionary'
import RootStore from 'src/stores/RootStore'

type connectionStatusProp =
  | 'supportedNetwork'
  | 'providerIsChanging'
  | 'activatingProvider'
  | 'isDisconnecting'

export default class Web3Connection {
  public rootStore: RootStore
  public supportedNetwork = true
  public providerType: ProviderType = ProviderType.None
  public walletAddress: string = ''
  public providerIsChanging = false
  public storedProvider: ProviderType = ProviderType.None
  public activatingProvider: ProviderType | null = null
  public isDisconnecting = false
  public web3React:
    | { connector: any; activate: any; deactivate: any; active: any; error: any }
    | undefined

  /**
   * eg: 0x1ba2...edf
   */
  get shortWalletAddress() {
    return hashUtils.shortHash(this.walletAddress)
  }

  /**
   * Gives info about displayName, reacrLogoSvgShort, connector
   */
  get providerTypeDetails(): ProviderTypeDetails | null {
    const providerType = this.activatingProvider || this.providerType
    return ProviderTypeDictionary.providerTypes.get(providerType) || null
  }

  /**
   * Computed link to etherscan for the active account (wallet address)
   * Eg: https://etherscan.io/address/0x56d811088235F11C8920698a204A5010a788f4b3
   */
  get etherscanWalletLink() {
    if (this.rootStore.etherscanURL && this.walletAddress) {
      return `${this.rootStore.etherscanURL}address/${this.walletAddress}`
    }
    return ''
  }

  get isConnected() {
    return this.providerType !== ProviderType.None && !!this.walletAddress
  }

  get wrongNetwork() {
    return !this.supportedNetwork
  }

  /**
   * We have a provider but no account selected yet
   */
  get isLoadingWallet() {
    return this.activatingProvider !== null && this.activatingProvider !== ProviderType.None
  }

  get hasProvider() {
    return (
      (this.activatingProvider !== null && this.activatingProvider !== ProviderType.None) ||
      this.providerType !== ProviderType.None
    )
  }

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: connectionStatusProp, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  /**
   * Helper to expose web3 react context and be able to control the connection in the data layer
   * TODO: add ts type for context
   */
  public getWeb3ReactContext(context: any) {
    this.web3React = context
  }

  /**
   * Connect to Ethereum using the specified provider type
   * @param providerType MetaMask, etc...
   */
  public async connect(providerType: ProviderType) {
    if (this.providerType !== ProviderType.None) {
      await this.disconnect()
    }
    const connector = ProviderTypeDictionary.getConnectorByProviderType(providerType)
    this.set('activatingProvider', providerType)
    if (this.web3React) {
      this.web3React.activate(connector)
    }
  }

  /**
   * Helper to activate the last used provider by the user.
   */
  public checkAndStartStoredProvider() {
    this.storedProvider = (localStorage.getItem('providerType') ||
      ProviderType.None) as ProviderType
    if (this.storedProvider !== ProviderType.None) {
      const storedConnector = ProviderTypeDictionary.getConnectorByProviderType(this.storedProvider)
      if (storedConnector) {
        this.activatingProvider = this.storedProvider
        if (this.web3React) {
          this.web3React.activate(storedConnector)
        }
      }
    } else {
      this.rootStore.stakingProvider.setReadonlyWeb3Provider()
    }
    return this.storedProvider
  }

  public async disconnect() {
    if (this.web3React) {
      try {
        this.set('isDisconnecting', true)
        this.web3React.deactivate()
        await this.rootStore.stakingProvider.setReadonlyWeb3Provider()
      } catch (err) {
        console.error(err)
      } finally {
        this.set('isDisconnecting', false)
      }
    }
  }

  public init() {
    const sp = this.rootStore.stakingProvider
    sp.on(
      'ProviderIsChanging',
      mobx.action(() => {
        this.providerIsChanging = true
      })
    )
    sp.on(
      'ProviderChanged',
      mobx.action((event) => {
        this.providerIsChanging = false
        this.supportedNetwork = !sp.unsupportedNetwork
        this.providerType = event.providerType
        this.activatingProvider = null
        this.walletAddress = sp.getCurrentAccount() || ''
      })
    )
    mobx.when(
      () => !!this.web3React,
      () =>
        setTimeout(() => {
          this.checkAndStartStoredProvider()
        }, 100)
    )
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
