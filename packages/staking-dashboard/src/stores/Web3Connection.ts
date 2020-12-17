import hashUtils from 'app-lib/hashUtils'
import * as mobx from 'mobx'
import ProviderType from 'src/domain/ProviderType'
import ProviderTypeDetails from 'src/domain/ProviderTypeDetails'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import RootStore from 'src/stores/RootStore'

type connectionStatusProp = 'supportedNetwork' | 'providerIsChanging' | 'activatingProvider'

export default class Web3Connection {
  public rootStore: RootStore
  public supportedNetwork = true
  public providerType: ProviderType = ProviderType.None
  public walletAddress: string = ''
  public providerIsChanging = false
  public storedProvider: ProviderType = ProviderType.None
  public activatingProvider: ProviderType | null = null
  public web3React: any

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
    return this.providerType !== ProviderType.None && this.walletAddress
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
    this.web3React.activate(connector)
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
        this.web3React.activate(storedConnector)
      }
    }
    return this.storedProvider
  }

  public disconnect() {
    this.web3React.deactivate()
    return this.rootStore.stakingProvider.setReadonlyWeb3Provider()
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
