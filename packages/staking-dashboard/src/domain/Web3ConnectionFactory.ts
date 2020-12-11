import { Web3Wrapper } from '@0x/web3-wrapper'

import {
  MetamaskSubprovider,
  RPCSubprovider,
  SignerSubprovider,
  Subprovider,
  Web3ProviderEngine
} from '@0x/subproviders'

import configProviders from '../config/providers.json'

import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import { ProviderType } from './ProviderType'
const ethNetwork = process.env.REACT_APP_ETH_NETWORK

export class Web3ConnectionFactory {
  public static rpcSubprovider: RPCSubprovider
  public static networkId: number
  public static canWrite: boolean
  public static userAccount: string | undefined
  public static currentWeb3Engine: Web3ProviderEngine
  public static currentWeb3Wrapper: Web3Wrapper

  public static async setWalletProvider(
    connector: AbstractConnector,
    providerType: ProviderType,
    web3ReactAccount?: string
  ) {
    let canWrite = false
    let networkId: number = 0
    let web3Wrapper: Web3Wrapper

    /*
      TODO:
      Set pollingInterval to 8000. Use https://github.com/MetaMask/eth-block-tracker with Web3ProviderEngine
      to poll for new blocks and use events to update the UI.

      interface Web3ProviderEngineOptions {
          pollingInterval?: number;
          blockTracker?: any;
          blockTrackerProvider?: any;
      }
    */

    const rpcSubprovider = await this.getRPCSubprovider()

    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling

    const provider = await connector.getProvider()
    try {
      
      const account = await connector.getAccount()
      const chainId = (await connector.getChainId()).toString()
      networkId = chainId.includes('0x') ? parseInt(chainId, 16) : parseInt(chainId, 10)
      
      let walletSubprovider: Subprovider
      switch (providerType) {
        case ProviderType.Ledger:
          // Ledger connector is the Web3ProviderEngine itself
          providerEngine = provider
          break
        case ProviderType.MetaMask:
          walletSubprovider = new MetamaskSubprovider(provider)
          providerEngine.addProvider(walletSubprovider)
          providerEngine.addProvider(rpcSubprovider)
          break
        case ProviderType.Trezor:
          // Trezor connector is the Web3ProviderEngine itself
          providerEngine = provider
          break
        default:
          walletSubprovider = new SignerSubprovider(provider)
          providerEngine.addProvider(walletSubprovider)
          providerEngine.addProvider(rpcSubprovider)
          break;
      }
      await providerEngine.start()
      
      canWrite = true
      Web3ConnectionFactory.userAccount = account
        ? account
        : web3ReactAccount
        ? web3ReactAccount
        : undefined
    } catch (e) {
      console.log(e)

      // rebuild providerEngine
      providerEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling
      providerEngine.addProvider(rpcSubprovider)

      await providerEngine.start()
    }
    
    web3Wrapper = new Web3Wrapper(providerEngine)
    Web3ConnectionFactory.networkId = networkId ? networkId : await web3Wrapper.getNetworkIdAsync()
    Web3ConnectionFactory.currentWeb3Engine = providerEngine
    Web3ConnectionFactory.currentWeb3Wrapper = web3Wrapper
    Web3ConnectionFactory.canWrite = canWrite
  }

  public static async setReadonlyProvider() {
    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling

    const rpcSubprovider = await this.getRPCSubprovider()
    providerEngine.addProvider(rpcSubprovider)

    // @ts-ignore
    await providerEngine.start()

    Web3ConnectionFactory.currentWeb3Engine = providerEngine
    Web3ConnectionFactory.currentWeb3Wrapper = new Web3Wrapper(providerEngine)
    Web3ConnectionFactory.networkId = await Web3ConnectionFactory.currentWeb3Wrapper.getNetworkIdAsync()
    Web3ConnectionFactory.canWrite = false
    Web3ConnectionFactory.userAccount = undefined
  }
  public static async updateConnector(update: ConnectorUpdate) {
    const { provider, chainId, account } = update
    if (chainId) {
      let networkId = chainId.toString()
      Web3ConnectionFactory.networkId = networkId.includes('0x')
        ? parseInt(networkId, 16)
        : parseInt(networkId, 10)
    }
    if (account) Web3ConnectionFactory.userAccount = account
  }

  public static async getRPCSubprovider(): Promise<RPCSubprovider> {
    const rpcUrl = Web3ConnectionFactory.getRPCUrl()
    return new RPCSubprovider(rpcUrl)
  }

  public static getRPCUrl(): string {
    let url
    let key
    if (process.env.NODE_ENV !== 'development') {
      if (ethNetwork === 'kovan') {
        key = configProviders.Alchemy_ApiKey_kovan
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      url = `https://eth-${ethNetwork}.alchemyapi.io/v2/${key}`
    } else {
      key = process.env.REACT_APP_INFURA_KEY // own developer's infura key
      url = `https://${ethNetwork}.infura.io/v3/${key}`
    }
    return url
  }
}
