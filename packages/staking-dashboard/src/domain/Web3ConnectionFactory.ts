import { Web3Wrapper } from '@0x/web3-wrapper'

import { SignerSubprovider, Web3ProviderEngine } from '@0x/subproviders'
// @ts-ignore
import { AlchemySubprovider } from '@alch/alchemy-web3'

import configProviders from '../config/providers.json'

import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'

const ethNetwork = process.env.REACT_APP_ETH_NETWORK

export class Web3ConnectionFactory {
  public static alchemyProvider: AlchemySubprovider
  public static networkId: number
  public static canWrite: boolean
  public static userAccount: string | null
  public static currentWeb3Engine: Web3ProviderEngine
  public static currentWeb3Wrapper: Web3Wrapper

  public static async setWalletProvider(connector: AbstractConnector, web3ReactAccount?: string) {
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
    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling

    const alchemyProvider = await this.getAlchemyProvider()
    providerEngine.addProvider(alchemyProvider)

    const provider = await connector.getProvider()

    try {
      providerEngine.addProvider(new SignerSubprovider(provider))
      await providerEngine.start()
      web3Wrapper = new Web3Wrapper(providerEngine)
      canWrite = true
      const chainId = (await connector.getChainId()).toString()
      networkId = chainId.includes('0x') ? parseInt(chainId, 16) : parseInt(chainId, 10)
      Web3ConnectionFactory.userAccount = web3ReactAccount
        ? web3ReactAccount
        : await connector.getAccount()
    } catch (e) {
      console.log(e)

      await providerEngine.stop()

      // rebuild providerEngine
      providerEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling
      providerEngine.addProvider(Web3ConnectionFactory.alchemyProvider)

      // @ts-ignore
      web3Wrapper = new Web3Wrapper(providerEngine)
    }
    Web3ConnectionFactory.networkId = networkId ? networkId : await web3Wrapper.getNetworkIdAsync()
    Web3ConnectionFactory.currentWeb3Engine = providerEngine
    Web3ConnectionFactory.currentWeb3Wrapper = web3Wrapper
    Web3ConnectionFactory.canWrite = canWrite
  }

  public static async setReadonlyProvider() {
    let providerEngine: Web3ProviderEngine = new Web3ProviderEngine({ pollingInterval: 3600000 }) // 1 hour polling

    const alchemyProvider = await this.getAlchemyProvider()
    providerEngine.addProvider(alchemyProvider)

    // @ts-ignore
    await providerEngine.start()

    Web3ConnectionFactory.currentWeb3Engine = providerEngine
    Web3ConnectionFactory.currentWeb3Wrapper = new Web3Wrapper(providerEngine)
    Web3ConnectionFactory.networkId = await Web3ConnectionFactory.currentWeb3Wrapper.getNetworkIdAsync()
    Web3ConnectionFactory.canWrite = false
    Web3ConnectionFactory.userAccount = null
  }

  public static async updateConnector(update: ConnectorUpdate) {
    const { chainId, account } = update

    if (chainId) {
      let networkId = chainId.toString()
      Web3ConnectionFactory.networkId = networkId.includes('0x')
        ? parseInt(networkId, 16)
        : parseInt(networkId, 10)
    }
    if (account) Web3ConnectionFactory.userAccount = account
  }

  public static async getAlchemyProvider(): Promise<AlchemySubprovider> {
    let key
    let url
    if (process.env.NODE_ENV !== 'development') {
      if (ethNetwork === 'kovan') {
        key = configProviders.Alchemy_ApiKey_kovan
      } else {
        key = configProviders.Alchemy_ApiKey
      }
      url = `https://eth-${ethNetwork}.alchemyapi.io/v2/${key}`
    } else {
      key = process.env.BZX_DEVELOPMENT_INFURA_KEY // own developer's infura key
      url = `https://${ethNetwork}.infura.io/v3/${key}`
    }
    return new AlchemySubprovider(url, {
      writeProvider: null
    })
  }
}
