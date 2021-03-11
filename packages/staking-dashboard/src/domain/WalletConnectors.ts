import { AuthereumConnector } from '@web3-react/authereum-connector'
import { BitskiConnector } from '@web3-react/bitski-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { SquarelinkConnector } from '@web3-react/squarelink-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import configProviders from 'bzx-common/src/config/providers'
import Web3ConnectionFactory from 'bzx-common/src/services/Web3ConnectionFactory'

const INITIAL_NETWORK = process.env.REACT_APP_ETH_NETWORK

const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}

const networkId = getNetworkIdByString(INITIAL_NETWORK)

const RPC_URL = Web3ConnectionFactory.getRPCUrl()

const POLLING_INTERVAL = 3600000

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 42, 1337] })

export const walletconnect = new WalletConnectConnector({
  rpc: { [networkId]: RPC_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URL,
  appName: 'bZx Stacking Dashboard '
})

export const ledger = new LedgerConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
  accountFetchingConfigs: {
    shouldAskForOnDeviceConfirmation: true,
    numAddressesToReturn: 100,
    addressSearchLimit: 1000
  }
})

export const trezor = new TrezorConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'hello@bzx.network',
  manifestAppUrl: window.location.origin,
  config: {
    networkId: networkId,
    accountFetchingConfigs: {
      shouldAskForOnDeviceConfirmation: true,
      numAddressesToReturn: 100,
      addressSearchLimit: 1000
    }
  }
})

export const authereum = new AuthereumConnector({ chainId: networkId })

export const fortmatic = new FortmaticConnector({
  apiKey: configProviders.Fortmatic_ApiKey,
  chainId: networkId
})

export const portis = new PortisConnector({
  dAppId: configProviders.Portis_DAppId,
  networks: [networkId]
})

export const squarelink = new SquarelinkConnector({
  clientId: configProviders.Squarelink_ClientId,
  networks: [networkId]
})

export const bitski = new BitskiConnector({
  clientId: configProviders.Bitski_ClientId,
  network: networkId,
  redirectUri: `${window.location.origin}/callback.html`
})

export const torus = new TorusConnector({
  chainId: networkId,
  constructorOptions: {
    buttonPosition: 'top-left' // default: bottom-left
  },
  initOptions: {
    buildEnv: 'production',
    enableLogging: false,
    network: {
      host: INITIAL_NETWORK || 'mainnet',
      chainId: networkId
    },
    showTorusButton: true
  }
})
