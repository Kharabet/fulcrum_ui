import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders'
import { Web3Wrapper } from '@0x/web3-wrapper'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import configProviders from 'bzx-common/src/config/providers.ts'
import appConfig from 'src/config/appConfig'
import ProviderType from 'bzx-common/src/domain/ProviderType'

export default class Web3ConnectionFactory {
  public static rpcSubprovider: RPCSubprovider
  public static networkId: number
  public static canWrite: boolean
  public static userAccount: string | undefined
  public static currentWeb3Engine: any
  public static currentWeb3Wrapper: Web3Wrapper
  public static currentConnector: AbstractConnector | undefined

  public static async setWalletProvider(
    connector: AbstractConnector,
    providerType: ProviderType,
    web3ReactAccount?: string
  ) {
    try {
      const provider = await connector.getProvider()
      const account = await connector.getAccount()
      const chainId = (await connector.getChainId()).toString()
      const networkId = chainId.includes('0x') ? parseInt(chainId, 16) : parseInt(chainId, 10)
      const web3Wrapper = new Web3Wrapper(provider)

      const canWrite = true
      Web3ConnectionFactory.userAccount = account
        ? account
        : web3ReactAccount
        ? web3ReactAccount
        : undefined

      Web3ConnectionFactory.currentWeb3Engine = provider
      Web3ConnectionFactory.networkId = networkId
        ? networkId
        : await web3Wrapper.getNetworkIdAsync()
      Web3ConnectionFactory.currentWeb3Wrapper = web3Wrapper
      Web3ConnectionFactory.canWrite = canWrite
    } catch (e) {
      console.error(e)
      return Web3ConnectionFactory.setReadonlyProvider()
    }
  }

  public static async setReadonlyProvider() {
    const providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling

    const rpcSubprovider = await this.getRPCSubprovider()
    providerEngine.addProvider(rpcSubprovider)

    return new Promise((resolve) => {
      providerEngine.start(async () => {
        Web3ConnectionFactory.currentWeb3Engine = providerEngine
        Web3ConnectionFactory.currentWeb3Wrapper = new Web3Wrapper(providerEngine)
        Web3ConnectionFactory.networkId = await Web3ConnectionFactory.currentWeb3Wrapper.getNetworkIdAsync()
        Web3ConnectionFactory.canWrite = false
        Web3ConnectionFactory.userAccount = undefined
        resolve(true)
      })
    })
  }

  public static updateConnector(update: ConnectorUpdate) {
    const { chainId, account } = update
    if (chainId) {
      const networkId = chainId.toString()
      Web3ConnectionFactory.networkId = networkId.includes('0x')
        ? parseInt(networkId, 16)
        : parseInt(networkId, 10)
    }
    if (account) {
      Web3ConnectionFactory.userAccount = account
    }
  }

  public static async getRPCSubprovider(): Promise<RPCSubprovider> {
    const rpcUrl = Web3ConnectionFactory.getRPCUrl()
    return new RPCSubprovider(rpcUrl)
  }

  public static getRPCUrl(): string {
    let url
    let key
    if (process.env.NODE_ENV !== 'development') {
      if (appConfig.isKovan) {
        key = configProviders.Alchemy_ApiKey_kovan
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      url = `https://eth-${appConfig.appNetwork}.alchemyapi.io/v2/${key}`
    } else {
      key = process.env.REACT_APP_INFURA_KEY // own developer's infura key
      // url = 'http://localhost:8545'
      url = `https://${appConfig.appNetwork}.infura.io/v3/${key}`
    }
    return url
  }
}
