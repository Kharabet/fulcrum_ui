import { InjectedConnector } from '@web3-react/injected-connector'
// import { NetworkConnector } from '@web3-react/network-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
// import { TrezorConnector } from '@web3-react/trezor-connector'
// import { FrameConnector } from '@web3-react/frame-connector'
// import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
// import { SquarelinkConnector } from '@web3-react/squarelink-connector'
import { SquarelinkConnector } from './SquarelinkCustomConnector'
import { BitskiConnector } from './BitskiCustomConnector'
// import { TorusConnector } from '@web3-react/torus-connector'


import configProviders from "../config/providers.json";
const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1;
    case 'ropsten':
      return 3;
    case 'rinkeby':
      return 4;
    case 'kovan':
      return 42;
    default:
      return 0;
  }
}
const networkId = getNetworkIdByString(process.env.REACT_APP_ETH_NETWORK);

const RPC_URL = networkId === 42
  ? `https://eth-${process.env.REACT_APP_ETH_NETWORK}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey_kovan}`
  : `https://eth-${process.env.REACT_APP_ETH_NETWORK}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`

const POLLING_INTERVAL = 3600000


export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 42] })

// export const network = new NetworkConnector({
//   urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//   defaultChainId: 1,
//   pollingInterval: POLLING_INTERVAL
// })

// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: RPC_URLS[1] },
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   pollingInterval: POLLING_INTERVAL
// })

// export const walletlink = new WalletLinkConnector({
//   url: RPC_URLS[1],
//   appName: 'web3-react example'
// })

export const ledger = new LedgerConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL
})

// export const trezor = new TrezorConnector({
//   chainId: 1,
//   url: RPC_URLS[1],
//   pollingInterval: POLLING_INTERVAL,
//   manifestEmail: 'dummy@abc.xyz',
//   manifestAppUrl: 'http://localhost:1234'
// })

// export const frame = new FrameConnector({ supportedChainIds: [1] })

// export const authereum = new AuthereumConnector({ chainId: 42 })

export const fortmatic = new FortmaticConnector({
  apiKey: configProviders.Fortmatic_ApiKey as string,
  chainId: networkId
})

export const portis = new PortisConnector({
  dAppId: configProviders.Portis_DAppId as string,
  networks: [networkId]
})

export const squarelink = new SquarelinkConnector({
  clientId: configProviders.Squarelink_ClientId as string,
  networks: [networkId]
})

export const bitski = new BitskiConnector({
  clientId: configProviders.Bitski_ClientId as string,
  network: networkId,
  redirectUri: `${location.origin}/callback.html`
})

// export const torus = new TorusConnector({ chainId: 1 })
